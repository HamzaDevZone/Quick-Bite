
'use client';

import { useOrders } from '@/hooks/use-orders';
import { UserHeader } from '@/components/user/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { OrderStatus, Order } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, UtensilsCrossed, Package, Check, ShoppingBag, User, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const statusDetails: Record<OrderStatus, { text: string; icon: React.ElementType; color: string }> = {
  Pending: { text: 'Pending', icon: Clock, color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
  Preparing: { text: 'Preparing', icon: UtensilsCrossed, color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
  Picked: { text: 'On its way!', icon: Package, color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  Delivered: { text: 'Delivered', icon: Check, color: 'bg-green-500/20 text-green-500 border-green-500/30' },
};

export default function ProfilePage() {
    const { orders, userOrderIds, loading } = useOrders();

    const userOrders = orders.filter(order => userOrderIds.includes(order.id));
    const latestOrder = userOrders.length > 0 ? userOrders[0] : null;

    const getDate = (date: Timestamp | string) => {
        if (typeof date === 'string') {
            return new Date(date);
        }
        return date.toDate();
    };

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
                                <CardDescription>This information is based on your most recent order.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {loading ? (
                                    <>
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-6 w-full" />
                                        <Skeleton className="h-6 w-4/5" />
                                    </>
                                ) : latestOrder ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                            <span>{latestOrder.customerName}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                            <span>{latestOrder.customerPhone}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                                            <span>{latestOrder.customerAddress}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No order information available yet.</p>
                                )}
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
                                                            <span className="text-muted-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between font-bold mt-4">
                                                    <span>Total</span>
                                                    <span>${order.total.toFixed(2)}</span>
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
