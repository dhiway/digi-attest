import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/credential/list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/credential/list"!</div>
}
