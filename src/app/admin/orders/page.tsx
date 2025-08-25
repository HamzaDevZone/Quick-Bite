
'use client';

import { useOrders } from '@/hooks/use-orders';
import { OrderDataTable } from '@/components/admin/OrderDataTable';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';

export default function AdminOrdersPage() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    
    useEffect(() => {
        const q = query(collection(db, "orders"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            ordersData.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
            setAllOrders(ordersData);
        });

        return () => unsubscribe();
    }, []);
    
    const liveOrders = allOrders.filter(order => order.status !== 'Delivered');

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Live Orders</h1>
            </div>
            <OrderDataTable data={liveOrders} />

            <div className="flex items-center justify-between mt-12 mb-6">
                <h2 className="text-2xl font-bold font-headline">Order History</h2>
            </div>
            <OrderDataTable data={allOrders} />
        </div>
    );
}
