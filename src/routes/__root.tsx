import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router';
import { App as CapacitorApp } from '@capacitor/app';

export function useBackButtonHandler() {
}

const RootLayout = () => {
  const router = useRouter();

  useEffect(() => {
    const handler = CapacitorApp.addListener('backButton', (event: any) => {
      if (router.history.canGoBack()) {
        router.history.back();
        event.preventDefault();
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => {
      handler.then((a) => a.remove());
    };
  }, [router]);
  return (
    <main className='main-container' >
      <div className='py-4 h-16 text-2xl justify-center items-center flex'>Logo</div>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </main>
  )
}
export const Route = createRootRoute({ component: RootLayout })

