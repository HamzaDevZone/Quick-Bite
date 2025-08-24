'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ProductProvider } from '@/hooks/use-products';
import { OrderProvider } from '@/hooks/use-orders';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const authenticated = sessionStorage.getItem('quickbite_admin_auth') === 'true';
            setIsAuth(authenticated);
            if (!authenticated && pathname !== '/admin/login') {
                router.replace('/admin/login');
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
    
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!isAuth) {
        return null;
    }

    return (
        <ProductProvider>
            <OrderProvider>
                <div className="flex min-h-screen">
                    <AdminSidebar />
                    <main className="flex-1 p-8 bg-secondary/40">
                        {children}
                    </main>
                </div>
            </OrderProvider>
        </ProductProvider>
    );
}
