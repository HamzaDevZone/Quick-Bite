
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserHeader } from '@/components/user/Header';
import { SplashScreen } from '@/components/user/SplashScreen';
import { UtensilsCrossed, ShoppingCart, Bike } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Skeleton } from '@/components/ui/skeleton';

export default function LandingPage() {
  const { settings, isLoading } = useSiteSettings();

  return (
    <>
      <SplashScreen />
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative h-[70vh] flex items-center justify-center text-center text-white bg-black/50">
             <Image 
                src={settings.heroImageUrl}
                alt="Delicious food background"
                fill
                priority
                quality={75}
                sizes="100vw"
                className="object-cover -z-10"
                data-ai-hint="delicious food background"
              />
            <div className="bg-black/60 p-8 rounded-lg z-10">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 font-headline uppercase">
                QuickBite Delivers
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
                Your favorite meals from local restaurants, delivered fast to your door.
              </p>
              <Button asChild size="lg" className="mt-8 rounded-full font-bold text-lg py-6 px-8">
                <Link href="/menu">Order Now</Link>
              </Button>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-secondary">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-2 font-headline uppercase text-primary">How It Works</h2>
              <p className="text-muted-foreground mb-12 max-w-xl mx-auto">Just a few simple steps to get your favorite food delivered.</p>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center">
                  <div className="p-6 bg-primary/20 border-2 border-primary rounded-full mb-4">
                    <UtensilsCrossed className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Choose Your Meal</h3>
                  <p className="text-muted-foreground">Browse through a wide variety of restaurants and dishes.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-6 bg-primary/20 border-2 border-primary rounded-full mb-4">
                    <ShoppingCart className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Place Your Order</h3>
                  <p className="text-muted-foreground">Add items to your cart and checkout in seconds.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-6 bg-primary/20 border-2 border-primary rounded-full mb-4">
                    <Bike className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-muted-foreground">Our riders will deliver your food hot and fresh.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
           <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4 font-headline uppercase">Ready to Order?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Don't wait! Find your next favorite meal and get it delivered right to you.
              </p>
              <Button asChild size="lg" className="rounded-full font-bold text-lg py-6 px-8">
                <Link href="/menu">Browse Menu</Link>
              </Button>
            </div>
          </section>
        </main>
        <footer className="bg-background border-t">
          <div className="container mx-auto py-6 px-4 text-center text-muted-foreground">
            <p>&copy; 2024 QuickBite. All Rights Reserved.</p>
            <p className="text-xs mt-2">
              Developed by Huzaifa. To get your own website, feel free to reach out.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
