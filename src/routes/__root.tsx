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
import { toast } from 'sonner'

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
      navigate({ to: '/', replace: true })
    },
    onError: () => {
      clearUser()
      navigate({ to: '/', replace: true })
    },
  })

  let lastBackPress = 0

  async function handleExit() {
    const now = Date.now()
    if (now - lastBackPress < 1500) {
      await CapacitorApp.exitApp()
    } else {
      lastBackPress = now
      // show toast/snackbar to confirm
      toast.message('Press back again to exit')
    }
  }


  async function goBack(event?: any, callback?: () => Promise<void>) {
    const path = window.location.pathname
    const isCredViewPath = path.startsWith('/credential/view')
    const isOrgListPath = path === '/organization/list'
    const isRootPath = path === '/'

    // 1️⃣ Handle credential view → credential list
    if (isCredViewPath) {
      const split = path.split('/')
      const orgId = split.at(-2)!
      const profileId = split.at(-1)!

      const prev = document.referrer || ''
      const cameFromList = prev.includes(`/credential/list/${orgId}/${profileId}`)

      if (cameFromList) {
        // user came from list, just go back
        window.history.back()
        return
      } else {
        // user came directly (e.g., deep link), go to list manually
        await navigate({
          to: '/credential/list/$orgId/$profileId',
          params: { orgId, profileId },
          replace: true,
        })
        return
      }
    }

    // 2️⃣ Handle "home" routes — exit app
    if (isOrgListPath || isRootPath) {
      if ((window as any).Capacitor?.isNativePlatform()) {
        await handleExit()
        return
      } else {
        return
      }
    }

    // 3️⃣ Generic browser or app back
    if (window.history.length > 1) {
      if (event?.preventDefault) event.preventDefault()
      window.history.back()
    } else if (callback) {
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
        className='cursor-pointer px-6 py-4 h-16 justify-between items-center flex'
      >
        {showButtons && (
          <span onClick={(e) => goBack(e, CapacitorApp.exitApp)}>
            <CiSquareChevLeft size={24} />
          </span>
        )}
        <span onClick={() => navigate({ to: '/', replace: true })} className='text-2xl mx-auto'>Logo</span>
        {showButtons && (
          <span onClick={() => signOutUser.mutateAsync()}>
            {user ? <CiLogout size={24} /> : <CiLogin size={24} />}Logout
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
