
'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle, Bike, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '../ui/sheet';
import { useState } from 'react';

const navLinks = [
    { href: '/menu', label: 'Menu' },
    { href: '/orders', label: 'My Orders' },
    { href: '/admin/login', label: 'Admin Panel', icon: UserCircle },
    { href: '/rider/login', label: 'Rider Panel', icon: Bike },
];

export function UserHeader() {
  const { itemCount } = useCart();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary font-headline">
          QuickBite
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
           <Button asChild variant="ghost">
              <Link href="/menu">Menu</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/orders">My Orders</Link>
            </Button>
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
            <Link href="/cart" passHref>
                <Button variant="ghost" size="icon" className="relative mr-2">
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
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px]">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col p-4 pt-10">
                        <Link href="/" className="text-2xl font-bold text-primary font-headline mb-8" onClick={() => setIsSheetOpen(false)}>
                            QuickBite
                        </Link>
                        <nav className="flex flex-col gap-3">
                            {navLinks.map(({ href, label, icon: Icon }) => (
                                <SheetClose key={href} asChild>
                                    <Link href={href} passHref>
                                        <Button variant="ghost" className="justify-start text-lg">
                                            {Icon && <Icon className="mr-2 h-5 w-5" />}
                                            {label}
                                        </Button>
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
