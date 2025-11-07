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
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: 1
  })

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-amber-900">Profiles</h1>
            <div className="text-sm text-amber-700 bg-amber-100/50 px-3 py-1 rounded-full">
              Organization ID: {orgId}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar/Stats Section */}
          {/* <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-6 shadow-sm sticky top-24">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CgProfile className="text-white text-2xl" />
                </div>
                <h3 className="font-semibold text-amber-900">Profile Management</h3>
                <p className="text-amber-600 text-sm mt-2">
                  {data?.length || 0} profile{data?.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25"
                onClick={() => navigate({ 'to': `/profile/create/${orgId}` })}
              >
                <CgProfile className="mr-2" />
                Add New Profile
              </Button>

              <div className="mt-6 p-4 bg-amber-50/50 rounded-xl border border-amber-200/30">
                <p className="text-xs text-amber-700 text-center">
                  Select a profile to manage credentials and access permissions
                </p>
              </div>
            </div>
          </div> */}


          <div className="lg:col-span-5">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ListSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-9">
                  <div>
                    <h2 className="text-lg font-semibold text-amber-900">All Profiles</h2>
                    <p className="text-amber-600 text-sm">
                      {data?.length || 0} profile{data?.length !== 1 ? 's' : ''} in your organization
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={() => navigate({ to: `/profile/create/${orgId}` })}
                  >
                    <CgProfile className="mr-2" />
                    Add Profile
                  </Button>
                </div>

                {/* Profiles Grid */}
                {data && data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.map((profile) => (
                      <Card
                        key={profile.id}
                        className="bg-white/80 backdrop-blur-sm border-amber-200/50 hover:border-amber-300/70 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer group hover:scale-105"
                        onClick={() => profileSelected(profile)}
                      >
                        <CardHeader className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                              <CgProfile className="text-white text-lg" />
                            </div>
                            <div className="w-2 h-2 bg-amber-400 rounded-full group-hover:bg-green-400 transition-colors"></div>
                          </div>

                          <CardTitle className="capitalize text-amber-900 text-lg font-bold mb-2 group-hover:text-amber-700 transition-colors">
                            {profile.name}
                          </CardTitle>

                          <CardDescription className="text-amber-600/80 lowercase line-clamp-2">
                            {profile.email || 'No email provided'}
                          </CardDescription>

                          <div className="mt-4 pt-4 border-t border-amber-100/50">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-amber-500 font-medium">View Credentials</span>
                              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Empty className="bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/50 py-12">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
                          <CgProfile className="text-white text-3xl" />
                        </div>
                      </EmptyMedia>
                      <EmptyTitle className="text-amber-900 text-xl font-bold">
                        {isError ? "Failed to Load Profiles" : "No Profiles Found"}
                      </EmptyTitle>
                      <EmptyDescription className="text-amber-600 max-w-md mx-auto">
                        {isError
                          ? "We encountered an issue loading your profiles. Please check your connection and try again."
                          : "Get started by creating your first profile to manage credentials and access permissions."
                        }
                      </EmptyDescription>
                    </EmptyHeader>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25"
                        onClick={() => navigate({ 'to': `/profile/create/${orgId}` })}
                      >
                        <CgProfile className="mr-2" />
                        Create First Profile
                      </Button>

                      {isError && (
                        <Button
                          variant="outline"
                          className="border-amber-300 text-amber-700 hover:bg-amber-50"
                          onClick={() => window.location.reload()}
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                  </Empty>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-20">
        <Button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30"
          onClick={() => navigate({ 'to': `/profile/create/${orgId}` })}
        >
          <CgProfile className="text-white text-xl" />
        </Button>
      </div>
    </div>
  )
}