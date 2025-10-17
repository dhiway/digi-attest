import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect, useState } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { useMutation } from '@tanstack/react-query'
import { signOut } from '@/lib/api'
import { useUserStore } from '@/store/user'
import { CiLogin, CiLogout, CiSquareChevLeft } from "react-icons/ci"

const RootLayout = () => {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const [showButtons, setShowButtons] = useState(false)

  const location = useRouterState({ select: (s) => s.location })

  const signOutUser = useMutation({
    mutationFn: async () => { await signOut() },
    onSuccess: () => navigate({ to: '/' }),
    onError: () => navigate({ to: '/' }),
  })

  async function goBack(event: any, callback: () => Promise<void>) {
    if (window.history.length > 1) {
      window.history.back()
      event.preventDefault()
    } else {
      await callback()
    }
  }

  useEffect(() => {
    setShowButtons(location.pathname !== '/')

    const handler = CapacitorApp.addListener('backButton', (event: any) => {
      goBack(event, CapacitorApp.exitApp)
    })

    return () => {
      handler.then((a) => a.remove())
    }
  }, [location.pathname])

  useEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', setHeight);
    setHeight();
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  return (
    <div>
      <header
        onClick={() => navigate({ to: '/' })}
        className='cursor-pointer px-6 py-4 h-16 justify-between items-center flex'
      >
        {showButtons && (
          <span onClick={(e) => goBack(e, CapacitorApp.exitApp)}>
            <CiSquareChevLeft size={24} />
          </span>
        )}
        <span className='text-2xl mx-auto'>Logo</span>
        {showButtons && (
          <span onClick={() => signOutUser.mutateAsync()}>
            {user ? <CiLogout size={24} /> : <CiLogin size={24} />}
          </span>
        )}
      </header>
      <main className='main-container'>
        <Outlet />
      </main>
      <TanStackRouterDevtools position='bottom-right' />
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })
