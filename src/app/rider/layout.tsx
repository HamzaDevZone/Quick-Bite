
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RiderSidebar } from '@/components/rider/RiderSidebar';
import { OrderProvider } from '@/hooks/use-orders';
import { Skeleton } from '@/components/ui/skeleton';
import { RiderProvider } from '@/hooks/use-riders';

export default function RiderLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const authData = sessionStorage.getItem('quickbite_rider_auth');
            const authenticated = authData ? JSON.parse(authData).isAuthenticated : false;
            setIsAuth(authenticated);
            if (!authenticated && pathname !== '/rider/login') {
                router.replace('/rider/login');
            }
        } catch (error) {
            console.warn('Could not access sessionStorage. Auth check skipped.');
        } finally {
            setIsLoading(false);
        }
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen">
                <div className="w-64 bg-sidebar p-4">
                    <Skeleton className="h-8 w-32 mb-8" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="flex-1 p-8">
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }
    
    if (pathname === '/rider/login') {
        return <RiderProvider>{children}</RiderProvider>;
    }

    if (!isAuth) {
        return null;
    }

    return (
        <RiderProvider>
          <OrderProvider>
              <div className="flex min-h-screen">
                  <RiderSidebar />
                  <main className="flex-1 p-8 bg-secondary/40">
                      {children}
                  </main>
              </div>
          </OrderProvider>
        </RiderProvider>
    );
}
