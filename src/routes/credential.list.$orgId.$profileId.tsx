import { Button } from '@/components/ui/button'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/credential/list/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { orgId, profileId } = useParams({ from: '/credential/list/$orgId/$profileId' })

  return <div className='main-container px-4 flex flex-col items-center'>
    <div className='flex-1'> No credentials </div>
    <Button className='w-3/4 mb-8' onClick={() => navigate({ 'to': '/credential/create/$orgId/$profileId', params: { orgId, profileId } })}> Add Credential </Button>
  </div>
}
