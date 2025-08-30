
'use client';

import { RiderOrderDataTable } from '@/components/rider/RiderOrderDataTable';
import { useOrders } from '@/hooks/use-orders';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function RiderHistoryPage() {
    const { orders } = useOrders();
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
                  {deliveryHistory.length === 0 && <TableCaption>No delivery history found.</TableCaption>}
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
                    <RiderOrderDataTable data={deliveryHistory} />
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
        </div>
    );
}
