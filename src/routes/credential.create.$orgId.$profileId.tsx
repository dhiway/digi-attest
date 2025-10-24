import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { ShadCNForm } from '@/components/RJSFShadCNForm'
import validator from '@rjsf/validator-ajv8'
import { useCredentialPhotoStore, useCredentialSchemaStore, useCredentialStore } from '@/store/credential'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { createCredential, type CredentialRequest } from '@/lib/api/credential'
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

export const Route = createFileRoute('/credential/create/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId, profileId } = useParams({ from: '/credential/create/$orgId/$profileId' })
  const [ocrOutput, setOcrOutput] = useState<OcrExtractedOutput | undefined>()
  const [ocrRunning, setOcrRunning] = useState(false)
  const { key: credentialImageKey, photo } = useCredentialPhotoStore()
  const { id: schemaId, name: schemaName, body } = useCredentialSchemaStore()
  const navigate = useNavigate()
  const { setCredential } = useCredentialStore()
  const [loading, setLoading] = useState(false)
  const createCredentialMutation = useMutation({
    mutationFn: async (payload: CredentialRequest) => {
      return await createCredential({ orgId, data: payload })
    },
    onSuccess: (created) => {
      setCredential(created)
      navigate({ to: '/credential/view/$orgId', params: { orgId: orgId } })
    },
    onError: (err: any) => {
      console.error('Error creating credential:', err)
      toast.error(err.response?.data?.message || 'Failed to create credential')
    },
  })

  const handleSubmit = async ({ formData }: any) => {
    if (!credentialImageKey) {
      toast.error('Please upload an image before submitting')
      return
    }

    setLoading(true)

    try {
      const payload = {
        name: schemaName,
        orgId,
        profileId,
        data: formData,
        schemaId: schemaId!,
        imageUrl: credentialImageKey,
      }

      await createCredentialMutation.mutateAsync(payload)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!photo) return
    if (!ocrOutput) {
      setOcrRunning(true)
      runOcr(photo, body, profileId).then(output => {
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
  return (<>
    <div className="main-container max-w-2xl mx-auto py-8 px-4">
      <ResizablePanelGroup
        direction="vertical"
        className="flex-1 max-w-md rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={65}>
          <div className="flex h-full items-baseline w-full justify-center p-6 overflow-y-scroll">
            <ShadCNForm
              schema={body}
              validator={validator}
              onSubmit={handleSubmit}
              disabled={loading}
              formData={ocrOutput?.formData || null}
            />
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
