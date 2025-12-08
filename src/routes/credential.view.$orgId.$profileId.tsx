import { createFileRoute, useNavigate, useParams, useRouter } from '@tanstack/react-router'
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
import { useCredentialPhotoStore, useCredentialSchemaStore, useCredentialStore } from '@/store/credential'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/credential/view/$orgId/$profileId')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { orgId, profileId } = useParams({ from: '/credential/view/$orgId/$profileId' })
  const { credential, clearCredential } = useCredentialStore()
  const { clearCredentialPhoto } = useCredentialPhotoStore()
  const { clearCredentialSchema } = useCredentialSchemaStore()
  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ['credentialImage', orgId, credential?.imageUrl],
    queryFn: async () => {
      if (!credential) throw new Error('No credential found')
      return await fetchCredentialImage({
        orgId,
        data: credential.imageUrl,
      })
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: 1,
    enabled: !!credential,
  })

  const router = useRouter()

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

  console.log("The data is", data);
  const AddAnotherCredential = () => {
    clearCredentialSchema()
    clearCredentialPhoto()
    navigate({ to: '/schema/select/$orgId/$profileId', params: { orgId, profileId }, replace: true })
  }

  return (
    <div className="main-container flex flex-col gap-4 max-w-2xl mx-auto py-10 px-4">
      <h1 className='font-semibold text-2xl'>{name}</h1>
      <Card className="relative border-none shadow-none flex-1 overflow-hidden">
        <CardContent className='border shadow-sm rounded-xl overflow-y-scroll'>
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

            <ItemContent className="space-y-1 mt-4 w-max">
              {Object.keys(data).map((key, i) => {
                const value = data[key];

                return (
                  <ItemDescription key={i + key} className="flex items-start w-max flex-col">
                    <span className="text-sm text-muted-foreground capitalize font-bold">{key}</span>

                    {/* if value is an object */}
                    {typeof value === "object" && value !== null ? (
                      <div className="ml-2">
                        {Object.keys(value).map((subKey, j) => (
                          <div key={j + subKey} className="flex gap-1">
                            <span className="font-medium capitalize">{subKey}:</span>
                            <span className="capitalize">{value[subKey]}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="font-medium text-foreground capitalize">{value}</span>
                    )}
                  </ItemDescription>
                );
              })}
            </ItemContent>

            <ItemFooter className="mt-4 text-xs text-muted-foreground">
              Created at: {new Date(credential.createdAt).toLocaleString()}
            </ItemFooter>
          </Item>
        </CardContent>
      </Card>
      <Button onClick={AddAnotherCredential}>Add Another Credential</Button>
    </div>
  )
}
