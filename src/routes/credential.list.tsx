import { Button } from '@/components/ui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/credential/list')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  return <div className='main-container px-4 flex flex-col items-center'>
    <div className='flex-1'> No credentials </div>
    <Button className='w-3/4 mb-8' onClick={() => navigate({ 'to': '/credential/create' })}> Add Credential </Button>
  </div>
}
