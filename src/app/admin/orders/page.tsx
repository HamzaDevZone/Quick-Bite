
'use client';

import { useOrders } from '@/hooks/use-orders';
import { OrderDataTable } from '@/components/admin/OrderDataTable';
import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminOrdersPage() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setAllOrders(ordersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    
    const liveOrders = useMemo(() => {
        return allOrders.filter(order => order.status !== 'Delivered');
    }, [allOrders]);

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-10 w-48" />
                </div>
                <Skeleton className="h-48 w-full" />

                <div className="flex items-center justify-between mt-12 mb-6">
                    <Skeleton className="h-8 w-56" />
                </div>
                 <Skeleton className="h-64 w-full" />
            </div>
        );
    }

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
