import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getProfiles } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/list/$orgId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return await getProfiles({})
    }, 'queryKey': ['profiles']
  })

  return (
    <div className='px-4 main-container flex flex-col items-center'>
      <section className='flex-1 w-full'>
        {isLoading ? <p> Loading...</p>
          : <></>
        }
        {data && data.map((profile) => {
          return <Card className='px-4 py-5' onClick={() => { navigate({ 'to': '/schema/select' }) }}>
            <p>{profile.metadata?.name || profile}</p>
          </Card>

        })
        }
      </section>
      <Button className='w-3/4 mb-8' onClick={() => navigate({ 'to': '/profile/create' })}> Add Profile </Button>
    </div>
  )
}
