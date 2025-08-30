
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, LogOut, UtensilsCrossed, ShoppingCart, Bike, Shapes, Palette, Users, Home, Wallet } from 'lucide-react';
import { useOrders } from '@/hooks/use-orders';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, notificationKey: 'orders' },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Shapes },
    { href: '/admin/riders', label: 'Riders', icon: Bike },
    { href: '/admin/admins', label: 'Admins', icon: Users },
    { href: '/admin/appearance', label: 'Appearance', icon: Palette },
    { href: '/admin/finance', label: 'Finance', icon: Wallet },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { orders } = useOrders();

    const handleLogout = () => {
        sessionStorage.removeItem('nexusmart_admin_auth');
        router.push('/admin/login');
    };
    
    const hasNewOrders = orders.some(order => order.status === 'Pending');

    const notificationStatus = {
        orders: hasNewOrders,
    }

    return (
        <aside className="w-64 flex-shrink-0 bg-background border-r">
            <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                    <Link href="/admin" className="flex items-center gap-2">
                        <UtensilsCrossed className="h-8 w-8 text-primary" />
                        <h1 className="text-xl font-bold font-headline">NexusMart Admin</h1>
                    </Link>
                </div>
                <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                        {navItems.map(item => (
                            <li key={item.href} className="relative">
                                <Link href={item.href}>
                                    <Button
                                        variant={pathname === item.href ? 'secondary' : 'ghost'}
                                        className="w-full justify-start"
                                    >
                                        <item.icon className="mr-2 h-5 w-5" />
                                        {item.label}
                                    </Button>
                                </Link>
                                {item.notificationKey && notificationStatus[item.notificationKey as keyof typeof notificationStatus] && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-destructive" />
                                )}
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
