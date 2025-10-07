import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/credential/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/credential/fill"!</div>
}
