
'use client';

import { RiderOrderDataTable } from '@/components/rider/RiderOrderDataTable';
import { useOrders } from '@/hooks/use-orders';
import { useState, useEffect } from 'react';

export default function RiderDashboardPage() {
    const { orders } = useOrders();
    const [riderId, setRiderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authData = sessionStorage.getItem('quickbite_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
        setIsLoading(false);
    }, []);

    const assignedOrders = orders.filter(order => order.riderId === riderId && order.status !== 'Delivered');
    const completedOrders = orders.filter(order => order.riderId === riderId && order.status === 'Delivered');

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Rider Dashboard</h1>
            
            <div className="mb-8">
                 <h2 className="text-2xl font-bold font-headline mb-4">Assigned Orders ({assignedOrders.length})</h2>
                <RiderOrderDataTable data={assignedOrders} />
            </div>

            <div>
                 <h2 className="text-2xl font-bold font-headline mb-4">Completed Deliveries ({completedOrders.length})</h2>
                <RiderOrderDataTable data={completedOrders} />
            </div>
        </div>
    );
}
