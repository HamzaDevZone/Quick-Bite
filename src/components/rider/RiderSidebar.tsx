'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, LogOut, Bike, History, User } from 'lucide-react';

const navItems = [
    { href: '/rider', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/rider/history', label: 'Delivery History', icon: History },
    { href: '/rider/profile', label: 'Profile', icon: User },
];

export function RiderSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem('quickbite_rider_auth');
        router.push('/rider/login');
    };

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
                            <li key={item.href}>
                                <Link href={item.href}>
                                    <Button
                                        variant={pathname.startsWith(item.href) && (item.href !== '/rider' || pathname === '/rider') ? 'secondary' : 'ghost'}
                                        className="w-full justify-start"
                                    >
                                        <item.icon className="mr-2 h-5 w-5" />
                                        {item.label}
                                    </Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 mt-auto border-t">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </div>
        </aside>
    );
}
