
'use client';

import { RiderOrderDataTable } from '@/components/rider/RiderOrderDataTable';
import { useOrders } from '@/hooks/use-orders';
import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RiderDashboardPage() {
    const { orders } = useOrders();
    const [riderId, setRiderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const locationWatcherId = useRef<number | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const authData = sessionStorage.getItem('quickbite_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
        setIsLoading(false);
    }, []);

    const startLocationSharing = () => {
        if (!navigator.geolocation) {
            toast({ variant: 'destructive', title: 'Error', description: 'Geolocation is not supported by your browser.' });
            return;
        }

        locationWatcherId.current = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                 if (riderId) {
                    try {
                        const locationDocRef = doc(db, 'riderLocations', riderId);
                        await setDoc(locationDocRef, {
                            lat: latitude,
                            lng: longitude,
                            timestamp: Timestamp.now(),
                        });
                    } catch (error) {
                         console.error("Failed to update location:", error);
                    }
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast({ variant: 'destructive', title: 'Location Error', description: 'Could not get your location. Please enable location services.' });
                stopLocationSharing();
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        setIsSharingLocation(true);
        toast({ title: 'Location Sharing Active', description: 'Your location is now being shared for live orders.' });
    };

    const stopLocationSharing = () => {
        if (locationWatcherId.current !== null) {
            navigator.geolocation.clearWatch(locationWatcherId.current);
            locationWatcherId.current = null;
        }
        setIsSharingLocation(false);
        toast({ title: 'Location Sharing Stopped', description: 'Your location is no longer being shared.' });
    };

    const handleToggleLocationSharing = () => {
        if (isSharingLocation) {
            stopLocationSharing();
        } else {
            startLocationSharing();
        }
    };
    
    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            stopLocationSharing();
        };
    }, []);

    const assignedOrders = orders.filter(order => order.riderId === riderId && order.status !== 'Delivered');
    const completedOrders = orders.filter(order => order.riderId === riderId && order.status === 'Delivered');

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold font-headline">Rider Dashboard</h1>
                 <Card className="p-2">
                     <Button onClick={handleToggleLocationSharing} variant={isSharingLocation ? 'destructive' : 'default'}>
                         <Power className={cn("mr-2 h-4 w-4", isSharingLocation && "animate-pulse")}/>
                        {isSharingLocation ? 'Stop Sharing Location' : 'Start Sharing Location'}
                     </Button>
                 </Card>
            </div>
            
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
