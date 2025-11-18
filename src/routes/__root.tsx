import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { useMutation } from '@tanstack/react-query'
import { signOut } from '@/lib/api'
import { useUserStore } from '@/store/user'
import { CiLogin, CiLogout, CiSquareChevLeft } from "react-icons/ci"
import { Toaster } from "@/components/ui/sonner"
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';
import Logo from '@/assets/Text_combained_logo.png'
import scribe from 'scribe.js-ocr';
import { toast } from 'sonner'
import { Avatar } from '@radix-ui/react-avatar'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { CiUser } from "react-icons/ci";

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
      toast.message('Press back again to exit')
    }
  }


  async function goBack(event?: any, callback?: () => Promise<void>) {
    const path = window.location.pathname
    const isCredViewPath = path.startsWith('/credential/view')
    const isOrgListPath = path === '/organization/list'
    const isRootPath = path === '/'

    // Handle credential view → credential list
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

    // Handle "home" routes — exit app
    if (isOrgListPath || isRootPath) {
      if ((window as any).Capacitor?.isNativePlatform()) {
        await handleExit()
        return
      } else {
        return
      }
    }

    // Generic browser or app back
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
    <div className='relative'>
      <header
        className='absolute top-0 w-full left-1/2 -translate-x-1/2 cursor-pointer px-6 py-4 h-20 justify-between items-center flex'
      >
        {showButtons && (
          <p onClick={(e) => goBack(e, CapacitorApp.exitApp)}>
            <CiSquareChevLeft size={24} />
          </p>
        )}
        <img onClick={() => navigate({ to: '/', replace: true })}
          src={Logo} className='w-1/2 max-w-14 mx-auto mt-1' />
        {showButtons && (
          <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
              <Avatar className='border shadow p-2 rounded-full aspect-square'>
                {!user ? <CiUser size={24} /> :
                  user?.name.split(" ")[0].slice(0, 1)}{user?.name.split(" ")[1]?.slice(0, 1)
                }
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mr-4 mt-2'>
              <DropdownMenuLabel> Hi, {user?.name.split(" ")[0]}</DropdownMenuLabel>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DropdownMenuItem onClick={() => signOutUser.mutateAsync()}>
                {user ? <CiLogout size={24} /> : <CiLogin size={24} />}
                {user ? "Logout" : "Login"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
      <main className='main-container pt-20'>
        <Toaster visibleToasts={1} position='bottom-right' />
        <Outlet />
      </main>
    </div >
  )
}

export const Route = createRootRoute({ component: RootLayout })
