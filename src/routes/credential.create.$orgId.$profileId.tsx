import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { ShadCNForm } from '@/components/RJSFShadCNForm'
import validator from '@rjsf/validator-ajv8'
import { useCredentialPhotoStore, useCredentialSchemaStore, useCredentialStore } from '@/store/credential'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { createCredential, draftCredential, uploadCredentialImage, type CredentialRequest, type DraftRequest } from '@/lib/api/credential'
import { toast } from 'sonner'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { type OcrExtractedOutput } from '@/lib/ocr/ocr-matcher'
import { Button } from '@/components/ui/button'
import { Clipboard } from '@capacitor/clipboard';
import { runOcr } from '@/lib/ocr'
import SuspenseLoader from '@/components/SuspenseLoader'
import { base64ToFile } from '@/lib/utils'
import { useOrganizationStore, useProfileStore } from '@/store/user'
import { ProcessLoader } from '@/components/ProcessLoader'

export const Route = createFileRoute('/credential/create/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId, profileId } = useParams({ from: '/credential/create/$orgId/$profileId' })
  const [ocrOutput, setOcrOutput] = useState<OcrExtractedOutput | undefined>()
  const { profile } = useProfileStore()
  const { organization } = useOrganizationStore()
  const [ocrRunning, setOcrRunning] = useState(false)
  const { photo, clearCredentialPhoto } = useCredentialPhotoStore()
  const { id: schemaId, name: schemaName, body, clearCredentialSchema } = useCredentialSchemaStore()
  const navigate = useNavigate()
  const { setCredential } = useCredentialStore()
  const [loading, setLoading] = useState(false)
  const formRef = useRef<any>(null);
  const createCredentialMutation = useMutation({
    mutationFn: async (payload: CredentialRequest) => {
      return await createCredential({ orgId, data: payload })
    },
    onSuccess: (created) => {
      setCredential(created)
      clearCredentialSchema()
      clearCredentialPhoto()
      navigate({ to: '/credential/view/$orgId/$profileId', params: { orgId, profileId } })
    },
    onError: (err: any) => {
      console.error('Error creating credential:', err)
      toast.error(err.response?.data?.message || 'Failed to create credential')
    },
  })
  const draftCredentialMutation = useMutation({
    mutationFn: async (payload: DraftRequest) => {
      return await draftCredential({ orgId, data: payload })
    },
    onSuccess: () => {
      toast.message('Credential Drafted sucessfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  })

  const createPhotoUploadMutation = useMutation({
    mutationFn: async (data: File) => await uploadCredentialImage({ data, orgId }),
    onSuccess: async (s3Key) => {
      return s3Key
    },
    onError: (error) => {
      toast.error(`Failed to upload the image \n ${error.message}`)
      return null
    }
  })

  const uploadPhoto = async (photo: string): Promise<string> => {
    const currentDate = new Date().getTime()
    const file = base64ToFile(photo, profileId + currentDate.toString())
    return await createPhotoUploadMutation.mutateAsync(file)
  }

  const handleSubmit = async ({ formData }: any, status: string) => {
    if (!photo?.base64) {
      return toast("No credential photo found")
    }
    setLoading(true)
    await uploadPhoto(photo.base64).then(async (key) => {
      try {
        if (status === 'active') {
          const payload = {
            name: schemaName || 'schema',
            orgId: organization?.id || orgId,
            profileId: profile?.id || profileId,
            data: formData,
            schemaId: schemaId!,
            imageUrl: key,
            status: status,
          }
          await createCredentialMutation.mutateAsync(payload)
        }
        if (status === 'draft') {
          const payload = {
            name: schemaName || 'schema',
            orgId: organization?.id || orgId,
            profileId: profile?.id || profileId,
            data: formData,
            schemaId: schemaId!,
            imageUrl: key,
            status: status,
          }
          await draftCredentialMutation.mutateAsync(payload)
        }
      } finally {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (!photo?.base64) return () => {
      navigate({ to: '..', replace: true })
    }
    if (!ocrOutput) {
      setOcrRunning(true)
      runOcr(photo, body, profileId).then(output => {
        console.log("the body is ", body.body)
        setOcrRunning(false)
        setOcrOutput(output)
      }).catch(() => {
        setOcrRunning(false)
        console.warn('Error occured during ocr run')
      })
    }
  }, [])


  const copyToClipboard = async (value: string) => {
    try {
      await Clipboard.write({ 'string': value })
      toast.success('Copied to clipboard')
    } catch (err) {
      toast.error('Failed to copy')
    }
  }
  if (ocrRunning) {
    return <SuspenseLoader message="Analyzing image using OCR" />
  }
  if (loading) return (
    <div className='main-container flex justify-center items-center'>
      <ProcessLoader title='Creating Credential' />
    </div>
  )
  return (<>
    <div className="main-container max-w-2xl mx-auto py-8 px-4">
      <ResizablePanelGroup
        direction="vertical"
        className="flex-1 max-w-md rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={65}>
          <div className="flex h-full items-baseline w-full justify-center p-6 overflow-y-scroll">
            <ShadCNForm
              ref={formRef}
              schema={body?.body ?? body}
              validator={validator}
              onSubmit={(data) => handleSubmit({ formData: data.formData }, "active")}
              disabled={loading}
              formData={ocrOutput?.formData || null}
              className="border-4"
            >
              <div className='m-4'>
                <div className="flex justify-between mt-6">
                <Button type="submit">Submit</Button>

                <Button
                  type="button"
                  onClick={() =>
                    handleSubmit({ formData: formRef.current?.state?.formData }, "draft")
                  }

                >
                  Save as Draft
                </Button>
              </div>
              </div>
            </ShadCNForm>

          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35}>
          {ocrOutput?.extracted ? (
            <ScrollArea className="bg-background w-96 rounded-md shadow whitespace-nowrap">
              <div id="autofill-bar" className="flex w-full justify-center space-x-6 p-4">
                {(() => {
                  // handle "no matches" logic
                  const isEmpty =
                    !ocrOutput ||
                    !ocrOutput.formData ||
                    !ocrOutput.extracted ||
                    (Object.values(ocrOutput.formData).every((v) => v === null) &&
                      Object.values(ocrOutput.extracted).every(
                        (arr) => Array.isArray(arr) && arr.length === 0
                      ));

                  if (isEmpty) {
                    return (
                      <Button variant="outline" className="w-max">
                        No Matches detected
                      </Button>
                    );
                  }

                  return Object.keys(ocrOutput.extracted).map((key) => {
                    const ext = ocrOutput.extracted![key];
                    if (!ext) return null;

                    return ext.map((a, i) => {
                      if (!a.value || a.value.trim() === '') return null;
                      return (
                        <Button
                          onClick={() => copyToClipboard(a.value || '')}
                          id={`${key}-${i}`}
                          key={`${key}-${i}`}
                          variant="outline"
                          className="w-max"
                        >
                          {a.value}
                        </Button>
                      );
                    });
                  });
                })()}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <Button variant="outline" className="w-max">
              No Matches detected
            </Button>
          )}

          <div className="flex h-full items-baseline justify-center p-6 overflow-scroll">
            <img src={photo?.dataUrl} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </>
  )
}
