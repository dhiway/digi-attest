import { Button } from '@/components/ui/button';
import { takePhoto } from '@/lib/capacitor/camera';
import { useCredentialPhotoStore } from '@/store/credential';
import { createFileRoute, useNavigate, useParams, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/credential/capture/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId, profileId } = useParams({ from: '/credential/capture/$orgId/$profileId' })
  const { setPhoto, photo, clearCredentialPhoto } = useCredentialPhotoStore()
  const navigate = useNavigate()

  const router = useRouter()
  useEffect(() => {
    const unsub = router.subscribe('onBeforeNavigate', (params) => {
      const next = (params.toLocation.href)
      if (!next.startsWith("/credential/create")) {
        clearCredentialPhoto()
      }
    })
    return () => unsub()
  }, [router])

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
    <section className='flex-1 mt-4 w-full'>
      {photo ? <img className='shadow' src={photo.dataUrl} /> : <></>}
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
      {photo ? <Button variant='outline' onClick={() => navigate({ to: `/credential/create/${orgId}/${profileId}` })}> Continue </Button> : <></>}
    </section>
  </div>
}
