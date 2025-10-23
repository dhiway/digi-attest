import ListSkeleton from '@/components/listSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
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
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      return await getProfiles({ orgId })
    },
    queryKey: ['profiles', orgId],
    retry: 1
  })

  const profileSelected = (profile: UserProfile) => {
    setActiveProfile(profile)
    navigate({ 'to': `/credential/list/${orgId}/${profile.id}` })
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
            return <Card key={profile.id} className='px-4 py-5' onClick={() => profileSelected(profile)}>
              <CardHeader>
                <CardTitle className='capitalize'>{profile.name}</CardTitle>
                <CardDescription className='lowercase'>{profile.email || ''}</CardDescription>
              </CardHeader>
            </Card>
          })
          }
          {isError && data?.length === 0 ?
            <Empty>
              <EmptyHeader>
                {/* <EmptyMedia variant="icon">
                  <GoOrganization size={32} />
                </EmptyMedia> */}
                <EmptyTitle>{isError ? "Failed to fetch Profiles" : "No Profiles"}</EmptyTitle>
                <EmptyDescription>
                  {isError ? "Please try again later." : "No profiles created yet. Get started by adding a profile."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
            : <></>}
        </section>
      </section>
      <Button className='w-3/4 ' onClick={() => navigate({ 'to': `/profile/create/${orgId}` })}> Add Profile </Button>
    </div>
  )
}
