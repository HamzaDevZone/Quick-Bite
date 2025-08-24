'use client';

import { useOrders } from '@/hooks/use-orders';
import { OrderDataTable } from '@/components/admin/OrderDataTable';

export default function AdminOrdersPage() {
    const { orders } = useOrders();
    
    // Filter out delivered orders to show only "live" ones
    const liveOrders = orders.filter(order => order.status !== 'Delivered');

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Live Orders</h1>
            </div>
            <OrderDataTable data={liveOrders} />

            <div className="flex items-center justify-between mt-12 mb-6">
                <h2 className="text-2xl font-bold font-headline">Order History</h2>
            </div>
            <OrderDataTable data={orders} />
        </div>
    );
}
