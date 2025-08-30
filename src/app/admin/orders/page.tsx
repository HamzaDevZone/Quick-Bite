
'use client';

import { OrderDataTable } from '@/components/admin/OrderDataTable';
import { db } from '@/lib/firebase';
import type { Order, ServiceType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

const serviceTypes: ServiceType[] = ['Food', 'Grocery', 'Electronics'];

export default function AdminOrdersPage() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setAllOrders(ordersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    
    const ordersByServiceType = useMemo(() => {
        const grouped: Record<ServiceType, Order[]> = {
            Food: [],
            Grocery: [],
            Electronics: [],
        };
        allOrders.forEach(order => {
            if (order.serviceType && grouped[order.serviceType]) {
                grouped[order.serviceType].push(order);
            }
        });
        return grouped;
    }, [allOrders]);

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-10 w-48" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Orders Dashboard</h1>
            </div>
            <Tabs defaultValue="Food" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    {serviceTypes.map(type => (
                        <TabsTrigger key={type} value={type}>{type} Orders</TabsTrigger>
                    ))}
                </TabsList>

                {serviceTypes.map(type => {
                    const liveOrders = ordersByServiceType[type].filter(order => order.status !== 'Delivered');
                    const orderHistory = ordersByServiceType[type];
                    
                    return (
                        <TabsContent key={type} value={type}>
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold font-headline mb-4">Live {type} Orders</h2>
                                <OrderDataTable data={liveOrders} />
                            </div>
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold font-headline mb-4">{type} Order History</h2>
                                <OrderDataTable data={orderHistory} />
                            </div>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}
