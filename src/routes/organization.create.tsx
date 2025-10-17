import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/organization/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/organization/create"!</div>
}
