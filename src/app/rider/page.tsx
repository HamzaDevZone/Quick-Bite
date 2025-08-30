
'use client';

import { RiderOrderDataTable } from '@/components/rider/RiderOrderDataTable';
import { useOrders } from '@/hooks/use-orders';
import { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCaption } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function RiderDashboardPage() {
    const { orders, loading: ordersLoading } = useOrders();
    const [riderId, setRiderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authData = sessionStorage.getItem('nexusmart_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
        setIsLoading(false);
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
                        <RiderOrderDataTable data={assignedOrders} />
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
                        <RiderOrderDataTable data={completedOrders} />
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
            </div>
        </div>
    );
}
