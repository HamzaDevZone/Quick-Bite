
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import { doc, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Wrapper } from "@googlemaps/react-wrapper";
import type { Order, RiderLocation } from '@/lib/types';
import { UserHeader } from '@/components/user/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bike, Clock, Home } from 'lucide-react';

// For simplicity, using a fixed restaurant location. This could come from settings.
const RESTAURANT_LOCATION = { lat: 33.6844, lng: 73.0479 }; // Islamabad coordinates

export default function TrackOrderPage() {
    const params = useParams();
    const orderId = params.orderId as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;
        
        let unsubscribeRider: Unsubscribe | undefined;

        const fetchOrder = async () => {
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);

            if (orderSnap.exists()) {
                const orderData = { id: orderSnap.id, ...orderSnap.data() } as Order;
                setOrder(orderData);

                if (orderData.riderId) {
                    const riderLocationRef = doc(db, 'riderLocations', orderData.riderId);
                    unsubscribeRider = onSnapshot(riderLocationRef, (doc) => {
                        if (doc.exists()) {
                            setRiderLocation(doc.data() as RiderLocation);
                        }
                    });
                }
            } else {
                notFound();
            }
            setLoading(false);
        };

        fetchOrder();

        return () => {
            if (unsubscribeRider) {
                unsubscribeRider();
            }
        };

    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <UserHeader />
                <main className="flex-grow container mx-auto px-4 py-12">
                     <Skeleton className="h-8 w-1/3 mb-4" />
                     <Skeleton className="h-4 w-1/2 mb-8" />
                     <Skeleton className="w-full h-[60vh] rounded-lg" />
                </main>
            </div>
        )
    }

    if (!order) {
        notFound();
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            <UserHeader />
            <main className="flex-grow container mx-auto px-4 py-12">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Tracking Order #{order.id}</CardTitle>
                        <CardDescription>Your order is on its way!</CardDescription>
                    </CardHeader>
                </Card>
                 <div className="w-full h-[60vh] rounded-lg overflow-hidden border">
                     <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                        <MapComponent 
                            restaurantLocation={RESTAURANT_LOCATION}
                            riderLocation={riderLocation}
                        />
                     </Wrapper>
                 </div>
            </main>
        </div>
    );
}

interface MapProps {
    restaurantLocation: { lat: number; lng: number };
    riderLocation: RiderLocation | null;
}

function MapComponent({ restaurantLocation, riderLocation }: MapProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const riderMarker = useRef<google.maps.Marker | null>(null);

    useEffect(() => {
        if (ref.current && !mapInstance.current) {
            mapInstance.current = new window.google.maps.Map(ref.current, {
                center: riderLocation ? { lat: riderLocation.lat, lng: riderLocation.lng } : restaurantLocation,
                zoom: 14,
            });

            // Restaurant Marker
            new window.google.maps.Marker({
                position: restaurantLocation,
                map: mapInstance.current,
                title: "Restaurant",
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeWeight: 0
                }
            });

             // Rider Marker
            if (riderLocation) {
                 riderMarker.current = new window.google.maps.Marker({
                    position: { lat: riderLocation.lat, lng: riderLocation.lng },
                    map: mapInstance.current,
                    title: "Rider",
                    icon: {
                       url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }
                });
            }
        }
    }, [restaurantLocation, riderLocation]);


     useEffect(() => {
        if (mapInstance.current && riderLocation) {
            const newPosition = { lat: riderLocation.lat, lng: riderLocation.lng };
            if (riderMarker.current) {
                riderMarker.current.setPosition(newPosition);
            } else {
                 riderMarker.current = new window.google.maps.Marker({
                    position: newPosition,
                    map: mapInstance.current,
                    title: "Rider",
                    icon: {
                       url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }
                });
            }
             mapInstance.current.panTo(newPosition);
        }
    }, [riderLocation]);

    return <div ref={ref} id="map" className="w-full h-full" />;
}
