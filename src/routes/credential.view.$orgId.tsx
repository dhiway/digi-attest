import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchCredentialImage } from '@/lib/api'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
} from '@/components/ui/item'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCredentialStore } from '@/store/credential'
import { useEffect } from 'react'

export const Route = createFileRoute('/credential/view/$orgId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId } = useParams({ from: '/credential/view/$orgId' })
  const { credential, clearCredential } = useCredentialStore()
  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ['credentialImage', orgId, credential?.imageUrl],
    queryFn: async () => {
      if (!credential) throw new Error('No credential found')
      return await fetchCredentialImage({
        orgId,
        data: credential.imageUrl,
      })
    },
    enabled: !!credential,
  })

  const router = useRouter()
  // Clear Stored State 
  useEffect(() => {
    const unsub = router.subscribe('onBeforeNavigate', () => {
      clearCredential()
    })
    return () => unsub()
  }, [router])

  if (!credential) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No credential found.
      </div>
    )
  }

  const { name, data } = credential

  return (
    <div className="main-container flex flex-col gap-4 max-w-2xl mx-auto py-10 px-4">
      <h1 className='font-semibold text-2xl'>{name}</h1>
      <Card className="border border-border relative flex-1 shadow-sm overflow-scroll">
        <CardContent>
          <Item className="p-4 rounded-lg border bg-card">
            <ItemMedia>
              {isLoading ? (
                <Skeleton className="h-48 w-48 rounded-lg" />
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="h-48 w-48 rounded-lg object-cover border"
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  No image available
                </div>
              )}
            </ItemMedia>

            <ItemContent className="space-y-1 mt-4">
              {Object.keys(data).map((key, i) => {
                return (
                  <ItemDescription key={i} className='max-w-fit'>
                    <span className="text-sm text-muted-foreground capitalize font-bold">{key}</span>
                    <span className="font-medium text-foreground">{data[key]}</span>
                  </ItemDescription>
                )
              })}
            </ItemContent>

            <ItemFooter className="mt-4 text-xs text-muted-foreground">
              Created at: {new Date(credential.createdAt).toLocaleString()}
            </ItemFooter>
          </Item>
        </CardContent>
      </Card>
    </div>
  )
}
