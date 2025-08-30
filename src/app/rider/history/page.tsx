
'use client';

import { useOrders } from '@/hooks/use-orders';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Order, OrderStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  Preparing: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  Picked: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  Delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
};

export default function RiderHistoryPage() {
    const { orders, updateOrderStatus } = useOrders();
    const [riderId, setRiderId] = useState<string | null>(null);

    useEffect(() => {
        const authData = sessionStorage.getItem('nexusmart_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
    }, []);

    const deliveryHistory = orders.filter(order => order.riderId === riderId && order.status === 'Delivered');
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Delivery History</h1>
            <div className="rounded-md border bg-card">
              <ScrollArea className="w-full whitespace-nowrap">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveryHistory.length > 0 ? (
                        deliveryHistory.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/rider/orders/${order.id}`} className="text-primary hover:underline">
                                        #{order.id}
                                    </Link>
                                </TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.customerAddress}</TableCell>
                                <TableCell className="text-right">PKR {order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                                    {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <Button variant="ghost" className="h-8 w-8 p-0" disabled>
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                No delivery history found.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
        </div>
    );
}
