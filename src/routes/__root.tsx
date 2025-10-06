import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
  <main className='w-svw h-svh overflow-hidden' >
    <div className='py-4 text-2xl justify-center items-center flex'>Logo</div>
    <Outlet />
    <TanStackRouterDevtools position='bottom-right' />
  </main>
)

export const Route = createRootRoute({ component: RootLayout })

