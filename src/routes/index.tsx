import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
/* import CameraLayout from '../components/camera' */

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()
  return (
    <section className='relative main-container overflow-hidden flex justify-center items-center'>
      <Button className='capitalize w-3/4' onClick={() => navigate({ 'to': '/profile/create' })}>
        create profile
      </Button>
    </section>
  )
}

