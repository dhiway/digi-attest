import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect, useState } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { useMutation } from '@tanstack/react-query'
import { signOut } from '@/lib/api'
import { useUserStore } from '@/store/user'
import { CiLogin, CiLogout, CiSquareChevLeft } from "react-icons/ci"
import { Toaster } from "@/components/ui/sonner"
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';
import scribe from 'scribe.js-ocr';

const RootLayout = () => {
  const navigate = useNavigate()
  const { user, clearUser } = useUserStore()
  const [showButtons, setShowButtons] = useState(false)

  const location = useRouterState({ select: (s) => s.location })

  try {
    scribe.init({ ocr: true, font: true })
  } catch (e: any) {
    console.warn('OCR Registration Failed: ', e.message)
  }
  const signOutUser = useMutation({
    mutationFn: async () => { await signOut() },
    onSuccess: () => {
      clearUser()
      navigate({ to: '/' })
    },
    onError: () => {
      clearUser()
      navigate({ to: '/' })
    },
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
    const setHeight = async () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
      try {
        await EdgeToEdge.setBackgroundColor({ color: '#f9f9f9' });
        await StatusBar.setStyle({ style: Style.Light });
      } catch { }
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
        <Toaster visibleToasts={1} position='bottom-right' />
        <Outlet />
      </main>
      <TanStackRouterDevtools position='bottom-right' />
    </div>
  )
}

export const Route = createRootRoute({ component: RootLayout })
