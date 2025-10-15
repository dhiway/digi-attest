import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router';
import { App as CapacitorApp } from '@capacitor/app';
import { useMutation } from '@tanstack/react-query';
import { signOut } from '@/lib/api';
import { useUserStore } from '@/store/user';

export function useBackButtonHandler() {
}

const RootLayout = () => {
  const router = useRouter();
  const navigate = useNavigate()
  const { user } = useUserStore()

  const signOutUser = useMutation({
    mutationFn: async () => { signOut() },
    onSuccess: () => {
      navigate({ to: '/' })
    },
    onError: () => {
      navigate({ to: '/' })
    },
  })


  async function goBack(event: any, callback: () => Promise<void>) {
    if (router.history.canGoBack()) {
      router.history.back();
      event.preventDefault();
    } else {
      await callback()
    }
  }
  useEffect(() => {
    const handler = CapacitorApp.addListener('backButton', (event: any) => {

      goBack(event, CapacitorApp.exitApp)
    });

    return () => {
      handler.then((a) => a.remove());
    };
  }, [router]);
  return (
    <main className='main-container' >
      <div onClick={() => navigate({ to: '/' })} className='cursor-pointer px-6 py-4 h-16 justify-between items-center flex'>
        <span onClick={(e) => { goBack(e, CapacitorApp.exitApp) }}>back</span>
        <span className='text-2xl'>Logo</span>
        <span onClick={() => signOutUser.mutateAsync()}>{user ? "logout" : " "}</span>
      </div>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </main>
  )
}
export const Route = createRootRoute({ component: RootLayout })

