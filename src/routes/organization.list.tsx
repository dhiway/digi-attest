import ListSkeleton from '@/components/listSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { listOrganizations } from '@/lib/api/organization'
import type { Organization } from '@/lib/api/organization/types'
import { useOrganizationStore } from '@/store/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GoOrganization } from "react-icons/go";
import { z } from 'zod/v4'

export const Route = createFileRoute('/organization/list')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setActiveOrganization } = useOrganizationStore()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["list-organizations"],
    queryFn: async () => {
      return await listOrganizations()
    },
    retry: 1
  })

  const selectOrganization = (org: Organization) => {
    setActiveOrganization(org)
    navigate({ to: `/profile/list/${org.id}` })
  }


  return <div className='main-container px-4 py-8 flex flex-col'>

    <section id='org-list' className='flex flex-col flex-1 gap-4 overflow-scroll'>
      {isLoading ? <ListSkeleton />
        :
        data && data.map(org =>
          <Card onClick={() => selectOrganization(org)}>
            <CardContent className='flex space-x-4 justify-between'>
              {z.safeParse(z.url(), org.logo).success ?
                <img alt='logo' src={org.logo} />
                : <GoOrganization size={32} />
              }
              <p className='flex items-center max-w-3/5 truncate capitalize'>{org.name}</p>
            </CardContent>
          </Card>)
      }
      {isError || data?.length === 0 ?
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GoOrganization size={32} />
            </EmptyMedia>
            <EmptyTitle>{isError ? "Failed to fetch Organizations" : "No Organizations"}</EmptyTitle>
            <EmptyDescription>
              {isError ? "Please try again later." : "You are not part of any organization yet. Get started by adding your organization."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
        : <></>}
    </section>
    <Button onClick={() => navigate({ to: '/organization/create' })}>Add Organization</Button>
  </div>
}
