
'use client';

import { UserHeader } from '@/components/user/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UtensilsCrossed, Facebook, Instagram } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ContactPage() {
    const { settings, isLoading } = useSiteSettings();

    return (
        <div className="min-h-screen flex flex-col">
            <UserHeader />
            <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="text-center">
                        <UtensilsCrossed className="mx-auto h-12 w-12 text-primary mb-4" />
                        <CardTitle className="text-3xl font-bold font-headline">About QuickBite</CardTitle>
                        <CardDescription>Your favorite meals, delivered fast.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-lg text-muted-foreground space-y-6 px-8 py-10">
                       <p>
                          Welcome to QuickBite, your number one source for fast and delicious food delivery. We're dedicated to giving you the very best of local cuisine, with a focus on speed, customer service, and quality.
                       </p>
                       <p>
                           Founded with a passion for food and technology, QuickBite has come a long way from its beginnings. We now serve customers all over the city and are thrilled to be a part of the fast-paced wing of the food industry.
                       </p>
                       <p>
                          We hope you enjoy our service as much as we enjoy offering it to you. If you have any questions or comments, please don't hesitate to follow us on our social channels!
                       </p>
                       <div className="flex justify-center gap-4 pt-4">
                           {settings.facebookUrl && (
                                <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12">
                                   <Link href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">
                                       <Facebook className="h-6 w-6" />
                                       <span className="sr-only">Facebook</span>
                                   </Link>
                                </Button>
                           )}
                           {settings.instagramUrl && (
                                <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12">
                                   <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                                       <Instagram className="h-6 w-6" />
                                       <span className="sr-only">Instagram</span>
                                   </Link>
                                </Button>
                           )}
                       </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
