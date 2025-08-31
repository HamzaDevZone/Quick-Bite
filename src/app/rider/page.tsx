
'use client';

import React from 'react';
import { useOrders } from '@/hooks/use-orders';
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCaption, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  Preparing: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  Picked: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  Delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
};


export default function RiderDashboardPage() {
    const { orders, updateOrderStatus, loading: ordersLoading } = useOrders();
    const [riderId, setRiderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const authData = sessionStorage.getItem('nexusmart_rider_auth');
            if (authData) {
                setRiderId(JSON.parse(authData).riderId);
            }
        } catch(error) {
            console.warn('Could not access sessionStorage for rider auth.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const assignedOrders = orders.filter(order => order.riderId === riderId && order.status !== 'Delivered');
    const completedOrders = orders.filter(order => order.riderId === riderId && order.status === 'Delivered');

    const totalLoading = ordersLoading || isLoading;

    if (totalLoading) {
        return (
             <div>
                <h1 className="text-3xl font-bold mb-6 font-headline">Rider Dashboard</h1>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full mt-8" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold font-headline">Rider Dashboard</h1>
            </div>
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold font-headline mb-4">Assigned Orders ({assignedOrders.length})</h2>
                <div className="rounded-md border bg-card">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <Table>
                       {assignedOrders.length === 0 && <TableCaption>No assigned orders found.</TableCaption>}
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
                        {assignedOrders.map(order => (
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Picked')} disabled={order.status !== 'Preparing'}>
                                                Mark as Picked
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Delivered')} disabled={order.status !== 'Picked'}>
                                                Mark as Delivered
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
            </div>

            <div>
                 <h2 className="text-2xl font-bold font-headline mb-4">Completed Deliveries ({completedOrders.length})</h2>
                 <div className="rounded-md border bg-card">
                  <ScrollArea className="w-full whitespace-nowrap">
                    <Table>
                      {completedOrders.length === 0 && <TableCaption>No completed orders found.</TableCaption>}
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
                         {completedOrders.map(order => (
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
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
            </div>
        </div>
    );
}
