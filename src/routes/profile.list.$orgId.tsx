import ListSkeleton from '@/components/listSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getProfiles, type UserProfile } from '@/lib/api'
import { useProfileStore } from '@/store/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/list/$orgId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { orgId } = useParams({
    from: '/profile/list/$orgId'
  })
  const { setActiveProfile } = useProfileStore()
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return await getProfiles({ orgId })
    },
    queryKey: ['profiles'],
    retry: 1
  })

  const profileSelected = (profile: UserProfile) => {
    setActiveProfile(profile)
    navigate({ 'to': `/schema/select/${orgId}/${profile.id}` })
  }

  return (
    <div className='px-4 py-8 main-container flex flex-col items-center'>
      <section className='flex-1 w-full'>
        {isLoading ?
          <ListSkeleton />
          : <></>
        }
        <section className='flex flex-col gap-4'>
          {data && data.map((profile) => {
            return <Card className='px-4 py-5' onClick={() => profileSelected(profile)}>
              <CardHeader>
                <CardTitle className='capitalize'>{profile.name}</CardTitle>
                <CardDescription className='lowercase'>{profile.email || ''}</CardDescription>
              </CardHeader>
            </Card>
          })
          }
        </section>
      </section>
      <Button className='w-3/4 ' onClick={() => navigate({ 'to': `/profile/create/${orgId}` })}> Add Profile </Button>
    </div>
  )
}
