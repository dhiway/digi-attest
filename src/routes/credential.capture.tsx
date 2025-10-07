import { Button } from '@/components/ui/button';
import { takePhoto } from '@/lib/capacitor/camera';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/credential/capture')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [photo, setPhoto] = useState<string | null>(null);

  return <div className='px-4 main-container flex items-center justify-center flex-col overflow-scroll'>
    <section>
      <h2 className='font-semibold text-lg'>Upload Document</h2>
      <p className='text-sm'>Upload existing photo from your device or take a new photo from your camera</p>
    </section>
    <section className='flex-1 mt-4 w-full border shadow'>
      {photo ? <img src={photo} /> : <span> </span>}
    </section>
    <section className='flex flex-col gap-4 w-4/5 mb-8'>
      <Button
        onClick={async () => { const photo = await takePhoto(); setPhoto(photo) }}
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
      {photo ? <Button variant='outline' onClick={() => navigate({ to: '/credential/create' })}> Continue </Button> : <></>}
    </section>
  </div>
}
