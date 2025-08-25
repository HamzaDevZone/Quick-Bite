
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, LogOut, Bike, History, User, Home, MessageSquare } from 'lucide-react';
import { useOrders } from '@/hooks/use-orders';
import { useEffect, useState } from 'react';

export function RiderSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { orders } = useOrders();
    const [riderId, setRiderId] = useState<string | null>(null);

     useEffect(() => {
        const authData = sessionStorage.getItem('quickbite_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('quickbite_rider_auth');
        router.push('/rider/login');
    };

    const hasAssignedOrders = orders.some(order => order.riderId === riderId && order.status === 'Preparing');

    const navItems = [
        { href: '/rider', label: 'Dashboard', icon: LayoutDashboard, notification: hasAssignedOrders },
        { href: '/rider/history', label: 'Delivery History', icon: History },
        { href: '/rider/profile', label: 'Profile', icon: User },
        { href: '/rider/contact', label: 'Contact Admin', icon: MessageSquare },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-background border-r">
            <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                    <Link href="/rider" className="flex items-center gap-2">
                        <Bike className="h-8 w-8 text-primary" />
                        <h1 className="text-xl font-bold font-headline">QuickBite Rider</h1>
                    </Link>
                </div>
                <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                        {navItems.map(item => (
                            <li key={item.href} className="relative">
                                <Link href={item.href}>
                                    <Button
                                        variant={pathname.startsWith(item.href) && (item.href !== '/rider' || pathname === '/rider') ? 'secondary' : 'ghost'}
                                        className="w-full justify-start"
                                    >
                                        <item.icon className="mr-2 h-5 w-5" />
                                        {item.label}
                                    </Button>
                                     {item.notification && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-destructive" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 mt-auto border-t">
                    <Link href="/menu" passHref>
                        <Button variant="ghost" className="w-full justify-start mb-2">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Menu
                        </Button>
                    </Link>
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </div>
        </aside>
    );
}
