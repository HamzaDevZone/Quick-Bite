
'use client';

import { useOrders } from '@/hooks/use-orders';
import { UserHeader } from '@/components/user/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Order, OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, UtensilsCrossed, Package, Check, ShoppingBag, MapPin, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const statusDetails: Record<OrderStatus, { text: string; icon: React.ElementType; color: string }> = {
  Pending: { text: 'Pending', icon: Clock, color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
  Preparing: { text: 'Preparing', icon: UtensilsCrossed, color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
  Picked: { text: 'On its way!', icon: Package, color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  Delivered: { text: 'Delivered', icon: Check, color: 'bg-green-500/20 text-green-500 border-green-500/30' },
};

export default function OrderHistoryPage() {
    const { user, loading: authLoading } = useAuth();
    const { orders, userOrderIds, loading: ordersLoading, deleteOrder } = useOrders();
    const router = useRouter();
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
             try {
                const storedOrderIds = JSON.parse(localStorage.getItem('nexusmart_user_orders') || '[]');
                if(storedOrderIds.length === 0) {
                    router.replace('/login');
                }
             } catch {
                router.replace('/login');
             }
        }
    }, [user, authLoading, router, userOrderIds]);

    const displayedOrders = useMemo(() => {
        if (user) {
            // This filters orders for the logged-in user based on what the hook provides.
            return orders.filter(order => order.userId === user.uid);
        }
        // For guest users, filter based on IDs stored in localStorage.
        return orders.filter(order => userOrderIds.includes(order.id));
    }, [orders, user, userOrderIds]);


    const getDate = (date: Timestamp | string) => {
        if (typeof date === 'string') {
            return new Date(date);
        }
        return date.toDate();
    };

    const handleDeleteConfirm = () => {
        if (orderToDelete) {
          deleteOrder(orderToDelete.id);
          setOrderToDelete(null);
        }
    };

    const isLoading = authLoading || ordersLoading;

    if (isLoading && displayedOrders.length === 0) {
        return (
             <div className="min-h-screen flex flex-col">
                <UserHeader />
                <main className="flex-grow container mx-auto px-4 py-12">
                     <Skeleton className="h-10 w-48 mb-8" />
                     <OrderSkeleton />
                     <OrderSkeleton />
                </main>
             </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <UserHeader />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 font-headline text-primary">My Orders</h1>
                {displayedOrders.length > 0 ? (
                    <div className="space-y-6">
                        {displayedOrders.map(order => {
                             const StatusIcon = statusDetails[order.status].icon;
                             return (
                                <Card key={order.id} className="bg-secondary relative">
                                    <CardHeader className="grid grid-cols-2 items-center">
                                        <div>
                                            <CardTitle className="break-all">Order #{order.id}</CardTitle>
                                            <CardDescription>
                                                {getDate(order.orderDate).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </CardDescription>
                                        </div>
                                        <div className="flex justify-end items-center gap-4">
                                            <Badge className={cn("text-base", statusDetails[order.status].color)}>
                                                <StatusIcon className="mr-2 h-4 w-4" />
                                                {statusDetails[order.status].text}
                                            </Badge>
                                        </div>
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
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="absolute top-2 right-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => setOrderToDelete(order)}
                                                >
                                                <Trash2 className="w-5 h-5"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your order history for order #{orderToDelete?.id}.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={() => setOrderToDelete(null)}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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
            </main>
        </div>
    );
}

const OrderSkeleton = () => (
    <Card className="bg-secondary mt-6">
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
