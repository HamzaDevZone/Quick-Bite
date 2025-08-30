
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { Rider } from '@/lib/types';
import { Bike, Mail, Phone, User } from 'lucide-react';
import { useRiders } from '@/hooks/use-riders';

export default function RiderProfilePage() {
    const [rider, setRider] = useState<Rider | null>(null);
    const { riders, loading } = useRiders();

    useEffect(() => {
        const authData = sessionStorage.getItem('nexusmart_rider_auth');
        if (authData && !loading) {
            const riderId = JSON.parse(authData).riderId;
            const currentRider = riders.find(r => r.id === riderId);
            setRider(currentRider || null);
        }
    }, [loading, riders]);

    if (loading || !rider) {
        return (
            <div>
                <h1 className="text-3xl font-bold mb-6 font-headline">My Profile</h1>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48"/>
                        <Skeleton className="h-4 w-64"/>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="space-y-2">
                           <Skeleton className="h-4 w-24"/>
                           <Skeleton className="h-10 w-full"/>
                       </div>
                       <div className="space-y-2">
                           <Skeleton className="h-4 w-24"/>
                           <Skeleton className="h-10 w-full"/>
                       </div>
                       <div className="space-y-2">
                           <Skeleton className="h-4 w-24"/>
                           <Skeleton className="h-10 w-full"/>
                       </div>
                       <div className="space-y-2">
                           <Skeleton className="h-4 w-24"/>
                           <Skeleton className="h-10 w-full"/>
                       </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">My Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User/> {rider.name}</CardTitle>
                    <CardDescription>Your personal and vehicle information. This information is managed by the admin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4"/> Name</Label>
                        <Input id="name" value={rider.name} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4"/> Email</Label>
                        <Input id="email" value={rider.email} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-4 h-4"/> Phone</Label>
                        <Input id="phone" value={rider.phone} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="vehicle" className="flex items-center gap-2"><Bike className="w-4 h-4"/> Vehicle Info</Label>
                        <Input id="vehicle" value={rider.vehicleInfo} readOnly />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
