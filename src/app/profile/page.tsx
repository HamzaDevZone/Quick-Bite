
'use client';

import { useOrders } from '@/hooks/use-orders';
import { UserHeader } from '@/components/user/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { OrderStatus, Order } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, UtensilsCrossed, Package, Check, ShoppingBag, User, Phone, MapPin, MessageSquare, Mail, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const statusDetails: Record<OrderStatus, { text: string; icon: React.ElementType; color: string }> = {
  Pending: { text: 'Pending', icon: Clock, color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
  Preparing: { text: 'Preparing', icon: UtensilsCrossed, color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
  Picked: { text: 'On its way!', icon: Package, color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  Delivered: { text: 'Delivered', icon: Check, color: 'bg-green-500/20 text-green-500 border-green-500/30' },
};

export default function ProfilePage() {
    const { user, loading: authLoading, logout } = useAuth();
    const { orders, userOrderIds, loading: ordersLoading } = useOrders();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
        }
    }, [user, authLoading, router]);

    const userOrders = orders.filter(order => userOrderIds.includes(order.id));
    
    const getDate = (date: Timestamp | string) => {
        if (typeof date === 'string') {
            return new Date(date);
        }
        return date.toDate();
    };

    const loading = authLoading || ordersLoading;

    if (loading || !user) {
        return (
             <div className="min-h-screen flex flex-col">
                <UserHeader />
                <main className="flex-grow container mx-auto px-4 py-12">
                     <Skeleton className="h-10 w-48 mb-8" />
                     <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-1 space-y-8">
                             <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32 mb-2" />
                                    <Skeleton className="h-4 w-48" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <Skeleton className="h-6 w-3/4" />
                                     <Skeleton className="h-6 w-full" />
                                </CardContent>
                             </Card>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-8 w-40 mb-4" />
                            <OrderSkeleton />
                            <OrderSkeleton />
                        </div>
                     </div>
                </main>
             </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <UserHeader />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 font-headline text-primary">My Profile</h1>
                
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-1 space-y-8">
                         <Card>
                            <CardHeader>
                                <CardTitle>My Details</CardTitle>
                                <CardDescription>This is your account information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <span>{user.displayName || 'No name set'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Support & Actions</CardTitle>
                                <CardDescription>Need help or want to sign out?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button asChild className="w-full">
                                    <Link href="/contact">
                                        <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4 font-headline">Order History</h2>
                         {loading ? (
                            <div className="space-y-6">
                                <OrderSkeleton />
                                <OrderSkeleton />
                            </div>
                        ) : userOrders.length > 0 ? (
                            <div className="space-y-6">
                                {userOrders.map(order => {
                                    const StatusIcon = statusDetails[order.status].icon;
                                    return (
                                        <Card key={order.id} className="bg-secondary">
                                            <CardHeader className="flex flex-row items-center justify-between">
                                                <div>
                                                    <CardTitle>Order #{order.id}</CardTitle>
                                                    <CardDescription>
                                                        {getDate(order.orderDate).toLocaleDateString('en-US', {
                                                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </CardDescription>
                                                </div>
                                                <Badge className={cn("text-base", statusDetails[order.status].color)}>
                                                    <StatusIcon className="mr-2 h-4 w-4" />
                                                    {statusDetails[order.status].text}
                                                </Badge>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 mb-4">
                                                    {order.items.map(item => (
                                                        <div key={item.product.id} className="flex justify-between items-center text-sm">
                                                            <span>{item.product.name} x {item.quantity}</span>
                                                            <span className="text-muted-foreground">PKR {(item.product.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between font-bold mt-4">
                                                    <span>Total</span>
                                                    <span>PKR {order.total.toFixed(2)}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        ) : (
                        <div className="text-center py-20 border-2 border-dashed border-secondary rounded-lg">
                                <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
                                <h2 className="mt-6 text-2xl font-semibold">No orders yet</h2>
                                <p className="mt-2 text-muted-foreground">You haven't placed any orders. Let's change that!</p>
                                <Button asChild className="mt-6 rounded-full">
                                <Link href="/menu">Start Shopping</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}


const OrderSkeleton = () => (
    <Card className="bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
        </CardHeader>
        <CardContent>
            <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <Separator />
            <div className="flex justify-between font-bold mt-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
            </div>
        </CardContent>
    </Card>
);
