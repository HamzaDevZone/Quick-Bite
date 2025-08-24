'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '../ui/badge';

export function UserHeader() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary font-headline">
          QuickBite
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6 text-accent" />
              {itemCount > 0 && (
                <Badge 
                  variant="destructive"
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full p-0"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/rider/login" passHref>
            <Button variant="ghost" size="icon">
              <Bike className="h-6 w-6 text-accent" />
            </Button>
          </Link>
          <Link href="/admin/login" passHref>
            <Button variant="ghost" size="icon">
              <UserCircle className="h-6 w-6 text-accent" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
