import ListSkeleton from '@/components/listSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getProfiles, type UserProfile } from '@/lib/api'
import { useProfileStore } from '@/store/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { CgProfile } from "react-icons/cg";

export const Route = createFileRoute('/profile/list/$orgId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { orgId } = useParams({
    from: '/profile/list/$orgId'
  })

  const { setActiveProfile, clearProfile } = useProfileStore()


  const { data, isLoading, isError } = useQuery({
    queryFn: async () => {
      return await getProfiles({ orgId })
    },
    queryKey: ['profiles', orgId],
    refetchOnWindowFocus: false,
    //refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: 1
  })
  console.log(data)

  const router = useRouter()
  useEffect(() => {
    const unsub = router.subscribe('onBeforeNavigate', (params) => {
      const next = (params.toLocation.href)
      if (!next.startsWith("/credential/list")) {
        clearProfile()
      }
    })
    return () => unsub()
  }, [router])

  const profileSelected = (profile: UserProfile) => {
    setActiveProfile(profile)
    navigate({ 'to': `/credential/list/${orgId}/${profile.id}` })
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50'>
      {/* header */}
      <header className='bg-white/80 backdrop-blur-md border-b border-amber-200/50 sticky top-0 z-10'>

        <div className=' p-6 flex flex-col justify-center items-center  gap-5  md:flex-row lg:flex-row md:justify-between lg:justify-between mx-20 transition-all duration-300'>
          <div className=' text-amber-600 font-bold text-xl md:text-2xl lg:text-2xl'>
            Profile List
          </div>
          <div className='text-base md:text-xl lg:text-2xl font-bold text-amber-600'>
            org name
          </div>
        </div>
      </header>

      <main className=' px-4 sm:px-6 lg:px-8 '>
        <div className='mx-6'>
          <div className='mx-6'>

            <div className=' p-3 flex flex-col justify-center items-center  gap-5  md:flex-row lg:flex-row md:justify-between lg:justify-between my-4 mx-3 transition-all duration-300'>
              <div className='text-amber-900 font-bold text-xl md:text-2xl lg:text-2xl'>
                Profiles <br />
                <span className=' font-normal text-sm text-amber-600'>Total profile{data?.length !== 1 ? 's' : ''} - {data?.length || 0} </span>
              </div>
              <div className='mt-7 border border-amber-300 rounded-lg hover:bg-amber-50 hover:border-amber-300/70 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300'>
                <Button className=" hover:text-red-500 text-amber-700 bg-white-100 hover:bg-amber-50 sm:flex" onClick={() => navigate({ 'to': `/profile/create/${orgId}` })}> Add Profile </Button>
              </div>
            </div>

            <div className=''>

              {/* <section className='' > */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ListSkeleton key={index} />
                  ))}
                </div>
              ) : <>
                {data && data.length > 0 ? (
                  <div className='flex-1 w-full place-items-center p-9 grid grid-cols-1 col-span-full md:grid-cols-2 lg:grid-cols-3 gap-7  '>
                    {data.map((profile) => {
                      return <Card key={profile.id} className=' bg-white/80 backdrop-blur-sm border-amber-200/50 hover:border-amber-300/70 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group  cursor-pointer transition-all duration-300 ease-in-out min-w-[170px] w-[200px] sm:w-[350px] md:w-[300px] md:h-[120px] px-4 py-5' onClick={() => profileSelected(profile)}>
                        <div className='flex justify-between'>

                          <CardHeader className=' flex-col items-left gap-5 mt-3'>
                            <CardTitle className='capitalize '>{profile.name}</CardTitle>
                            <CardDescription className='lowercase text-[10px] md:text-sm '>{profile.email || ''}</CardDescription>
                          </CardHeader>

                          <div className='rounded w-2 h-2 border-5 border-amber-300 group-hover:border-green-400 transition-colors duration-300'></div>
                        </div>
                      </Card>
                    })
                    }
                  </div>
                )
                  : <div>
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <CgProfile size={32} />
                        </EmptyMedia>
                        <EmptyTitle>{isError ? "Failed to fetch Profiles" : "No Profiles"}</EmptyTitle>
                        <EmptyDescription>
                          {isError ? "Please try again later." : "No profiles created yet. Get started by adding a profile."}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </div>
                }

              </>
              }
              {/* </section> */}
            </div>
          </div>
          <div>
          </div>
        </div>
      </main>
    </div>
  )
}
