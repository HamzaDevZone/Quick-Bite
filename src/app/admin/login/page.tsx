'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';
import { useAdmins } from '@/hooks/use-admins';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();
    const { admins, loading } = useAdmins();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Special case: If no admins exist in the database, allow default login
        if (!loading && admins.length === 0) {
            if (email === 'admin@example.com' && password === 'password') {
                try {
                    sessionStorage.setItem('quickbite_admin_auth', 'true');
                    toast({ title: 'Login Successful (Default)', description: 'Please create your own admin account now.' });
                    router.push('/admin/admins');
                } catch (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Login Failed',
                        description: 'Could not set session. Please enable cookies/storage and try again.',
                    });
                }
                return;
            }
        }

        // Regular login check
        const adminUser = admins.find(admin => admin.email === email && admin.password === password);

        if (adminUser) {
            try {
                sessionStorage.setItem('quickbite_admin_auth', 'true');
                toast({ title: 'Login Successful', description: 'Redirecting to dashboard...' });
                router.push('/admin');
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
                        <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
                        <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
                        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
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
                            {loading ? 'Loading...' : 'Login'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
