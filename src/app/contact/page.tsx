
'use client';

import { UserHeader } from '@/components/user/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UtensilsCrossed, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);


export default function ContactPage() {
    const { settings, isLoading } = useSiteSettings();

    return (
        <div className="min-h-screen flex flex-col">
            <UserHeader />
            <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="text-center">
                        <UtensilsCrossed className="mx-auto h-12 w-12 text-primary mb-4" />
                        <CardTitle className="text-3xl font-bold font-headline">About NexusMart</CardTitle>
                        <CardDescription>Your favorite items, delivered fast.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-lg text-muted-foreground space-y-6 px-8 py-10">
                       <p>
                          Welcome to NexusMart, your number one source for fast and reliable local delivery. We're dedicated to giving you the very best of local commerce, with a focus on speed, customer service, and quality.
                       </p>
                       <p>
                           Founded with a passion for connecting communities with technology, NexusMart has come a long way from its beginnings. We now serve customers all over the city and are thrilled to be a part of the fast-paced wing of the e-commerce industry.
                       </p>
                       <p>
                          For any questions or comments about your order, please don't hesitate to reach out to us directly.
                       </p>
                       <div className="flex justify-center pt-4">
                           {settings.whatsappUrl && (
                                <Button asChild size="lg" className="rounded-full">
                                   <Link href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer">
                                       <WhatsAppIcon className="mr-2 h-6 w-6" />
                                       Contact us on WhatsApp
                                   </Link>
                                </Button>
                           )}
                       </div>
                    </CardContent>
                    <CardFooter className="flex-col items-center justify-center text-center p-6 border-t">
                        <p className="text-sm font-semibold text-foreground">Developed by Huzaifa</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-md">
                          This application was brought to life by a passionate developer. For inquiries about getting your own custom web solution, feel free to connect via social media.
                        </p>
                         <div className="flex justify-center gap-4 pt-4">
                           {settings.facebookUrl && (
                                <Button asChild variant="outline" size="icon" className="rounded-full h-10 w-10">
                                   <Link href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">
                                       <Facebook className="h-5 w-5" />
                                       <span className="sr-only">Facebook</span>
                                   </Link>
                                </Button>
                           )}
                           {settings.instagramUrl && (
                                <Button asChild variant="outline" size="icon" className="rounded-full h-10 w-10">
                                   <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                                       <Instagram className="h-5 w-5" />
                                       <span className="sr-only">Instagram</span>
                                   </Link>
                                </Button>
                           )}
                       </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
