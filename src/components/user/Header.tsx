
'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle, Bike, Menu, MessageSquare, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '../ui/sheet';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Separator } from '../ui/separator';

export function UserHeader() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navLinks = [
    { href: '/menu', label: 'Menu' },
    { href: '/orders', label: 'My Orders' },
    ...(user ? [{ href: '/profile', label: 'My Profile', icon: UserCircle }] : []),
    { href: '/contact', label: 'Contact Us', icon: MessageSquare },
  ];

  const authLinks = !user ? [
    { href: '/login', label: 'Login', icon: LogIn },
    { href: '/signup', label: 'Sign Up', icon: UserPlus },
  ] : [
    { action: logout, label: 'Logout', icon: LogOut }
  ];

  const adminLinks = [
      { href: '/admin/login', label: 'Admin Panel', icon: UserCircle },
      { href: '/rider/login', label: 'Rider Panel', icon: Bike },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-primary font-headline">
          QuickBite
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
           {navLinks.map(({ href, label }) => (
             href && <Button asChild variant="ghost" key={href}>
                <Link href={href}>{label}</Link>
              </Button>
           ))}
            
            {user ? (
                 <Button variant="ghost" onClick={logout}>
                    <LogOut className="mr-2" /> Logout
                </Button>
            ) : (
                <>
                <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
                </>
            )}

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
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col p-4 pt-10 h-full">
                        <Link href="/" className="text-2xl font-bold text-primary font-headline mb-8" onClick={() => setIsSheetOpen(false)}>
                            QuickBite
                        </Link>
                        <nav className="flex flex-col gap-3">
                            {navLinks.map(({ href, label, icon: Icon }) => (
                                href && <SheetClose key={href} asChild>
                                    <Link href={href} passHref>
                                        <Button variant="ghost" className="justify-start text-lg">
                                            {Icon && <Icon className="mr-2 h-5 w-5" />}
                                            {label}
                                        </Button>
                                    </Link>
                                </SheetClose>
                            ))}
                        </nav>
                        <div className="mt-auto border-t pt-4">
                             <nav className="flex flex-col gap-3">
                                {authLinks.map(({ href, label, icon: Icon, action }) => (
                                     <SheetClose key={label} asChild>
                                        {action ? (
                                             <Button variant="ghost" className="justify-start text-lg" onClick={()=>{action(); setIsSheetOpen(false);}}>
                                                {Icon && <Icon className="mr-2 h-5 w-5" />}
                                                {label}
                                            </Button>
                                        ) : (
                                            <Link href={href!} passHref>
                                                <Button variant="ghost" className="justify-start text-lg">
                                                    {Icon && <Icon className="mr-2 h-5 w-5" />}
                                                    {label}
                                                </Button>
                                            </Link>
                                        )}
                                    </SheetClose>
                                ))}
                                <Separator className="my-2" />
                                {adminLinks.map(({ href, label, icon: Icon }) => (
                                     <SheetClose key={href} asChild>
                                        <Link href={href} passHref>
                                            <Button variant="ghost" className="justify-start text-sm text-muted-foreground">
                                                {Icon && <Icon className="mr-2 h-4 w-4" />}
                                                {label}
                                            </Button>
                                        </Link>
                                    </SheetClose>
                                ))}
                             </nav>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
