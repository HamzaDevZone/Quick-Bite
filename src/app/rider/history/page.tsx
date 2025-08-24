'use client';

import { RiderOrderDataTable } from '@/components/rider/RiderOrderDataTable';
import { useOrders } from '@/hooks/use-orders';
import { useState, useEffect } from 'react';

export default function RiderHistoryPage() {
    const { orders } = useOrders();
    const [riderId, setRiderId] = useState<string | null>(null);

    useEffect(() => {
        const authData = sessionStorage.getItem('quickbite_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
    }, []);

    const deliveryHistory = orders.filter(order => order.riderId === riderId);
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Delivery History</h1>
            <RiderOrderDataTable data={deliveryHistory} />
        </div>
    );
}
