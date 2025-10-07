import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'

const RootLayout = () => {
  useEffect(() => {
    document.documentElement.classList.toggle('dark')
  }, [])
  return (
    <main className='main-container' >
      <div className='py-4 h-16 text-2xl justify-center items-center flex'>Logo</div>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </main>
  )
}
export const Route = createRootRoute({ component: RootLayout })

