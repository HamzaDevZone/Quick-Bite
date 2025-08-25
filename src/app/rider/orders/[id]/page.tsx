
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrders } from '@/hooks/use-orders';
import { OrderStatus, Order } from '@/lib/types';
import { ArrowLeft, Check, Bike, Package, Wallet, User, Phone, MapPin, StickyNote } from 'lucide-react';
import Image from 'next/image';

export default function RiderOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { orders, updateOrderStatus } = useOrders();
    const order = orders.find(o => o.id === params.id);

    if (!order) {
        return <div className="text-center p-8">Order not found.</div>;
    }
    
    const handleStatusUpdate = (status: OrderStatus) => {
        updateOrderStatus(order.id, status);
    };

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
                            <CardTitle>Order Details (#{order.id})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.product.id} className="flex items-center gap-4">
                                        <Image src={item.product.imageUrl} alt={item.product.name} width={64} height={64} className="rounded-md" data-ai-hint="food item"/>
                                        <div>
                                            <p className="font-medium">{item.product.name} <span className="text-sm text-muted-foreground">x {item.quantity}</span></p>
                                            <p className="text-sm text-muted-foreground">PKR {item.product.price.toFixed(2)}</p>
                                        </div>
                                        <p className="ml-auto font-semibold">PKR {(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <Separator/>
                                <div className="flex justify-between font-bold text-lg items-center">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-base font-medium">{order.paymentMethod}</span>
                                    </div>
                                    <span>Total: PKR {order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-3">
                           <p className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/> {order.customerName}</p>
                           <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground"/> {order.customerPhone}</p>
                           <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-muted-foreground mt-1"/> {order.customerAddress}</p>
                        </CardContent>
                    </Card>
                     {order.orderNotes && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2"><StickyNote className="w-5 h-5"/> Order Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{order.orderNotes}</p>
                            </CardContent>
                        </Card>
                    )}
                     <Card>
                        <CardHeader>
                            <CardTitle>Update Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                           <Button 
                                onClick={() => handleStatusUpdate('Picked')} 
                                disabled={order.status !== 'Preparing'}
                                className="w-full"
                            >
                                <Package className="mr-2 h-4 w-4" /> Mark as Picked Up
                           </Button>
                           <Button 
                                onClick={() => handleStatusUpdate('Delivered')} 
                                disabled={order.status !== 'Picked'}
                                className="w-full"
                           >
                                <Check className="mr-2 h-4 w-4" /> Mark as Delivered
                           </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
