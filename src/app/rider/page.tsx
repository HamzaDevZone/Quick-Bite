'use client';

import { RiderOrderDataTable } from '@/components/rider/RiderOrderDataTable';
import { useOrders } from '@/hooks/use-orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, CheckCircle, ListOrdered } from 'lucide-react';

export default function RiderDashboardPage() {
    const { orders } = useOrders();
    const [riderId, setRiderId] = useState<string | null>(null);

    useEffect(() => {
        const authData = sessionStorage.getItem('quickbite_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
    }, []);

    const assignedOrders = orders.filter(order => order.riderId === riderId && order.status !== 'Delivered');
    const completedOrders = orders.filter(order => order.riderId === riderId && order.status === 'Delivered');

    if (riderId === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Rider Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Assigned Deliveries</CardTitle>
                        <ListOrdered className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assignedOrders.length}</div>
                        <p className="text-xs text-muted-foreground">Active orders to be delivered</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedOrders.length}</div>
                        <p className="text-xs text-muted-foreground">Total deliveries completed</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Status</CardTitle>
                        <Bike className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Online</div>
                        <p className="text-xs text-muted-foreground">You are ready for deliveries</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="mb-8">
                 <h2 className="text-2xl font-bold font-headline mb-4">Assigned Orders</h2>
                <RiderOrderDataTable data={assignedOrders} />
            </div>

            <div>
                 <h2 className="text-2xl font-bold font-headline mb-4">Delivery History</h2>
                <RiderOrderDataTable data={completedOrders} />
            </div>
        </div>
    );
}
