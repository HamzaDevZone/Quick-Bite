
'use client';

import { OrderDataTable } from '@/components/admin/OrderDataTable';
import { db } from '@/lib/firebase';
import type { Order, MainCategory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useCategories } from '@/hooks/use-categories';

export default function AdminOrdersPage() {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { mainCategories, loading: categoriesLoading } = useCategories();
    
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setAllOrders(ordersData);
            if (!categoriesLoading) {
                setLoading(false);
            }
        }, (error) => {
            console.error("Error fetching orders:", error);
            if (!categoriesLoading) {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [categoriesLoading]);
    
    const ordersByMainCategory = useMemo(() => {
        const grouped = new Map<string, Order[]>();
        mainCategories.forEach(mc => grouped.set(mc.id, []));
        
        allOrders.forEach(order => {
            if (order.mainCategoryId && grouped.has(order.mainCategoryId)) {
                grouped.get(order.mainCategoryId)!.push(order);
            }
        });
        return grouped;
    }, [allOrders, mainCategories]);

    if (loading || categoriesLoading) {
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
            {mainCategories.length > 0 ? (
                <Tabs defaultValue={mainCategories[0].id} className="w-full">
                    <TabsList className="grid w-full" style={{gridTemplateColumns: `repeat(${mainCategories.length}, 1fr)`}}>
                        {mainCategories.map(mc => (
                            <TabsTrigger key={mc.id} value={mc.id}>{mc.name} Orders</TabsTrigger>
                        ))}
                    </TabsList>

                    {mainCategories.map(mc => {
                        const categoryOrders = ordersByMainCategory.get(mc.id) || [];
                        const liveOrders = categoryOrders.filter(order => order.status !== 'Delivered');
                        const orderHistory = categoryOrders;
                        
                        return (
                            <TabsContent key={mc.id} value={mc.id}>
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold font-headline mb-4">Live {mc.name} Orders</h2>
                                    <OrderDataTable data={liveOrders} />
                                </div>
                                <div className="mt-12">
                                    <h2 className="text-2xl font-bold font-headline mb-4">{mc.name} Order History</h2>
                                    <OrderDataTable data={orderHistory} />
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            ) : (
                <p className="text-muted-foreground text-center py-10">No main categories found. Please add a category to see orders.</p>
            )}
        </div>
    );
}
