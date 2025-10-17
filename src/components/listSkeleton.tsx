import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

const ListSkeleton = () => {
  return (
    <Card className="flex items-center space-x-4">
      <CardContent className='flex gap-4'>
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </CardContent>
    </Card>
  )
}

export default ListSkeleton
