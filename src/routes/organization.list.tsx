import ListSkeleton from '@/components/listSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { listOrganizations } from '@/lib/api/organization'
import type { Organization } from '@/lib/api/organization/types'
import { useOrganizationStore, useUserStore } from '@/store/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { GoChevronRight, GoOrganization, GoPlusCircle } from "react-icons/go";
import { z } from 'zod/v4'

export const Route = createFileRoute('/organization/list')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setActiveOrganization, clearOrganization } = useOrganizationStore()
  const navigate = useNavigate()
  const { user } = useUserStore()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["list-organizations", user?.id],
    queryFn: async () => {
      return await listOrganizations()
    },
    refetchOnWindowFocus: false,
    //refetchOnMount: true,
    staleTime: 1000 * 60 * 60,
    retry: 1
  })

  console.log("The error occured", isError)
  console.log(data)
  const router = useRouter()

  useEffect(() => {
    const unsub = router.subscribe('onBeforeNavigate', (params) => {
      const next = (params.toLocation.href)
      if (!next.startsWith("/profile/list"))
        clearOrganization()
    })
    return () => unsub()
  }, [router])

  const selectOrganization = (org: Organization) => {
    setActiveOrganization(org)
    navigate({ to: `/profile/list/${org.id}` })
  }


  return (

    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 '>

      <header className="bg-white/80 backdrop-blur-md border-b border-amber-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Organizations
              </h1>

            </div>

            {user && (
              <div className="flex items-center gap-3 bg-white/50 rounded-2xl px-4 py-2 border border-amber-200/30">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-amber-900">{user.name}</p>
                  <p className="text-xs text-amber-600/70">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-4">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-2">
                  Your Organizations
                </h2>
                <p className="text-amber-600">
                  {data?.length || 0} organization{data?.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 sm:flex"
                  onClick={() => navigate({ to: '/organization/create' })}
                >
                  <GoOrganization className="mr-2" />
                  Add Organization
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ListSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
                {data && data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.map((org) => (
                      <Card
                        key={org.id}
                        className="bg-white/80 backdrop-blur-sm border-amber-200/50 hover:border-amber-300/70 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer group hover:scale-105"
                        onClick={() => selectOrganization(org)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                              {z.safeParse(z.url(), org.logo).success ? (
                                <img
                                  alt='logo'
                                  src={org.logo}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <GoOrganization className="text-white text-2xl" />
                              )}
                            </div>
                            <div className="w-3 h-3 bg-amber-400 rounded-full group-hover:bg-green-400 transition-colors mt-2"></div>
                          </div>

                          <h3 className="font-bold text-amber-900 text-lg mb-2 group-hover:text-amber-700 transition-colors line-clamp-2 capitalize">
                            {org.name}
                          </h3>

                          <div className="flex items-center justify-between text-sm text-amber-500 mt-4 pt-4 border-t border-amber-100/50">
                            <span className="font-medium">View Profiles</span>
                            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                              <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Empty className="bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/50 py-16">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <div className=" w-20 h-18 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
                          <GoOrganization className="text-white text-4xl" />
                        </div>
                      </EmptyMedia>
                      <EmptyTitle className="text-red-600 text-2xl font-bold">
                        {isError ? "Failed to Load Organizations" : "No Organizations Found"}
                      </EmptyTitle>
                      <EmptyDescription className="text-red-400 max-w-md mx-auto text-lg">
                        {isError
                          ? "We encountered an issue loading your organizations. Please check your connection and try again."
                          : <div className='mt-2 flex flex-col gap-9 justify-center items-center'>
                            <p className=''>Get started by creating your first organization . </p>
                            <GoPlusCircle className="text-amber-400 animate-bounce hover:text-green-500" size={50} onClick={() => navigate({ to: '/organization/create' })} /></div>

                        }
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </>

            )
            }
          </div>
        </div>
      </main >
    </div >
  )
}
