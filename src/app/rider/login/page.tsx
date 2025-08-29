
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bike } from 'lucide-react';
import { useRiders } from '@/hooks/use-riders';

export default function RiderLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();
    const { riders, loading } = useRiders();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const rider = riders.find(r => r.email === email && r.password === password);

        if (rider) {
            try {
                sessionStorage.setItem('quickbite_rider_auth', JSON.stringify({isAuthenticated: true, riderId: rider.id}));
                toast({ title: 'Login Successful', description: 'Redirecting to your dashboard...' });
                router.push('/rider');
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Login Failed',
                    description: 'Could not set session. Please enable cookies/storage and try again.',
                });
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid Credentials',
                description: 'Please check your email and password.',
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleLogin}>
                    <CardHeader className="text-center">
                        <Bike className="mx-auto h-12 w-12 text-primary mb-4" />
                        <CardTitle className="text-2xl font-bold">Rider Panel</CardTitle>
                        <CardDescription>Enter your credentials to manage your deliveries.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="rider@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Loading Riders...' : 'Login'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
