
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/hooks/use-orders';
import { useRiders } from '@/hooks/use-riders';
import { OrderStatus, Rider, Order } from '@/lib/types';
import { ArrowLeft, User, Phone, MapPin, DollarSign, Clock, Bike, Check, Package, UtensilsCrossed, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  Preparing: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  Picked: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  Delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
};

const statusIcons: Record<OrderStatus, React.ElementType> = {
  Pending: Clock,
  Preparing: UtensilsCrossed,
  Picked: Package,
  Delivered: Check,
}

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { updateOrderStatus, assignRiderToOrder } = useOrders();
    const { riders } = useRiders();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchOrder = async () => {
        if (!params.id) return;
        setLoading(true);
        try {
          const docRef = doc(db, 'orders', params.id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
          } else {
            // Handle not found
          }
        } catch (error) {
          console.error("Failed to fetch order", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }, [params.id]);


    if (loading) {
       return (
        <div>
            <Button variant="ghost" disabled className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
            </Button>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="md:col-span-1 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
        </div>
      );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                 <ShoppingCart className="w-16 h-16 mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold">Order Not Found</h2>
                <p className="text-muted-foreground">The requested order could not be found.</p>
                <Button variant="outline" onClick={() => router.back()} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Button>
            </div>
        );
    }

    const getDate = (date: Timestamp | string) => {
        if (typeof date === 'string') {
            return new Date(date);
        }
        return date.toDate();
    };
    
    const handleStatusUpdate = (status: OrderStatus) => {
        updateOrderStatus(order.id, status);
        setOrder(prev => prev ? { ...prev, status } : null);
    };

    const handleRiderAssign = (riderId: string) => {
      if(riderId) {
        assignRiderToOrder(order.id, riderId)
        setOrder(prev => prev ? { ...prev, riderId, status: 'Preparing' } : null);
      }
    }

    const currentRider = riders.find(r => r.id === order.riderId);
    const CurrentStatusIcon = statusIcons[order.status];

    return (
        <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
            </Button>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Order #{order.id}</span>
                                <Badge className={cn("text-base", statusColors[order.status])}>
                                  <CurrentStatusIcon className="mr-2 h-4 w-4"/>
                                  {order.status}
                                </Badge>
                            </CardTitle>
                             <div className="text-sm text-muted-foreground flex items-center gap-4 pt-2">
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {getDate(order.orderDate).toLocaleString()}</span>
                                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> {order.paymentMethod}</span>
                             </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.product.id} className="flex items-center gap-4 p-2 rounded-md bg-secondary/50">
                                        <Image src={item.product.imageUrl} alt={item.product.name} width={64} height={64} className="rounded-md" data-ai-hint="food item"/>
                                        <div className="flex-grow">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">PKR {(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-secondary/30 p-4 rounded-b-lg">
                            <div className="w-full flex justify-end">
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Delivery Fee: PKR {order.deliveryFee.toFixed(2)}</div>
                                    <div className="text-xl font-bold">Total: PKR {order.total.toFixed(2)}</div>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <p className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/> {order.customerName}</p>
                           <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground"/> {order.customerPhone}</p>
                           <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-muted-foreground mt-1"/> {order.customerAddress}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Order Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Assign Rider</label>
                            <Select onValueChange={handleRiderAssign} defaultValue={order.riderId}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a rider..." />
                              </SelectTrigger>
                              <SelectContent>
                                {riders.map(rider => (
                                  <SelectItem key={rider.id} value={rider.id}>{rider.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Update Status</label>
                            <Select onValueChange={(status) => handleStatusUpdate(status as OrderStatus)} defaultValue={order.status}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status..."/>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Preparing">Preparing</SelectItem>
                                <SelectItem value="Picked">Picked</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
