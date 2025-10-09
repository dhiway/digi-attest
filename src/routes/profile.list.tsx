import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/list')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className='px-4 main-container flex flex-col items-center'>
      <section className='flex-1 w-full'>
        <Card className='px-4 py-5' onClick={() => { navigate({ 'to': '/schema/select' }) }}>
          <p> Go to Profile</p>
        </Card>
      </section>
      <Button className='w-3/4 mb-8' onClick={() => navigate({ 'to': '/profile/create' })}> Add Profile </Button>
    </div>
  )
}
