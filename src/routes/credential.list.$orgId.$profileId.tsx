import ListSkeleton from '@/components/listSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { listCredentials, } from '@/lib/api'
import { useCredentialStore, type Credential } from '@/store/credential'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/credential/list/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { orgId, profileId } = useParams({ from: '/credential/list/$orgId/$profileId' })
  const { data, isLoading, isError } = useQuery({
    queryKey: ["credentials-list", orgId, profileId],
    queryFn: async () => { return listCredentials({ orgId, page: 1, limit: 20, profileId }) }
  })
  const { setCredential } = useCredentialStore()

  const credSelected = (cred: Credential) => {
    setCredential(cred)
    navigate({ to: '/credential/view/$orgId', 'params': { orgId } })
  }

  return <div className='main-container px-4 py-8 flex flex-col items-center'>
    {isLoading ?
      <ListSkeleton />
      : <></>
    }
    <section className='flex-1 flex flex-col gap-4 w-full'>
      {data && data.map((cred) =>
        <Card key={cred.id} className='px-4 py-5 w-full' onClick={() => credSelected(cred)}>
          <CardHeader>
            <CardTitle className='capitalize'>{cred.name}</CardTitle>
          </CardHeader>
        </Card>
      )}
      {isError || data?.length === 0 ?
        <Empty>
          <EmptyHeader>
            {/* <EmptyMedia variant="icon">
                  <GoOrganization size={32} />
                </EmptyMedia> */}
            <EmptyTitle>{isError ? "Failed to fetch Credentials" : "No Credentials"}</EmptyTitle>
            <EmptyDescription>
              {isError ? "Please try again later." : "No Credentials added yet. Get started by adding a credential."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
        : <></>}
    </section>
    <Button className='w-full' onClick={() => navigate({ 'to': '/schema/select/$orgId/$profileId', params: { orgId, profileId } })}>
      Add Credential
    </Button>
  </div>
}
