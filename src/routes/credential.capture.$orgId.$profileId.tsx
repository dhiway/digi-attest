import { Button } from '@/components/ui/button';
import { uploadCredentialImage } from '@/lib/api';
import { takePhoto } from '@/lib/capacitor/camera';
import { base64ToFile } from '@/lib/utils';
import { useCredentialPhotoStore } from '@/store/credential';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner';

export const Route = createFileRoute('/credential/capture/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId, profileId } = useParams({ from: '/credential/capture/$orgId/$profileId' })
  const { setKey, setPhoto, photo } = useCredentialPhotoStore()
  const navigate = useNavigate()

  const mutate = useMutation({
    mutationFn: async (data: File) => await uploadCredentialImage({ data, orgId }),
    onSuccess: async (s3Key) => {
      setKey({ key: s3Key })
      navigate({ to: `/credential/create/${orgId}/${profileId}` })
    },
    onError: (error) => {
      toast.error(`Failed to upload the image \n ${error.message}`)
    }
  })

  const uploadPhoto = async (photo: string) => {
    const currentDate = new Date().getTime()
    const file = base64ToFile(photo, profileId + currentDate.toString())
    mutate.mutateAsync(file)
  }

  async function capturePhoto() {
    try {
      const photo = await takePhoto()
      if (photo) {
        setPhoto({ photo: photo })
      }
    } catch (e) { console.log(e) }
  }

  return <div className='px-4 main-container flex items-center justify-center flex-col overflow-scroll'>
    <section>
      <h2 className='font-semibold text-lg'>Upload Document</h2>
      <p className='text-sm'>Upload existing photo from your device or take a new photo from your camera</p>
    </section>
    <section className='flex-1 mt-4 w-full border shadow'>
      {photo ? <img src={photo.dataUrl} /> : <pre> {mutate.error ? JSON.stringify(mutate.error) : <></>} </pre>}
    </section>
    <section className='flex flex-col gap-4 w-4/5 mb-8'>
      <Button
        onClick={capturePhoto}
        className="mt-6 p-4 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 
          2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 
          012-2zm9 3a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
        {photo ? "Retake Photo" : "Take Photo"}
      </Button>
      {photo ? <Button variant='outline' onClick={() => uploadPhoto(photo.base64!)}> Continue </Button> : <></>}
    </section>
  </div>
}
