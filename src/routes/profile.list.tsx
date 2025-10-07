import { Card } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/list')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  return <div className='px-4'>
    <Card onClick={() => { navigate({ 'to': '/schema/select' }) }}>
      <p> Go to Profile</p>
    </Card>
  </div>
}
