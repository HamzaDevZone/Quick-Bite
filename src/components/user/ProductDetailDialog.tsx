
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { Minus, Plus, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { useSiteSettings } from '@/hooks/use-site-settings';
import Link from 'next/link';
import { Separator } from '../ui/separator';


interface ProductDetailDialogProps {
    product: Product;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({ product, isOpen, onOpenChange }: ProductDetailDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { settings } = useSiteSettings();

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onOpenChange(false); // Close dialog after adding to cart
  };

  const inquiryLink = settings.productInquiryLink;
  const inquiryLogo = settings.productInquiryLogoUrl;

  return (
     <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <DialogDescription className="sr-only">{product.description}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-full">
                <div className="flex flex-col gap-4 pr-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                        <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        quality={75}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-500 hover:scale-105"
                        data-ai-hint="food item detail"
                        />
                    </div>
                    <div className="flex flex-col gap-4 p-1">
                        <h1 className="text-3xl font-bold font-headline text-primary">{product.name}</h1>
                        <p className="text-md text-muted-foreground">{product.description}</p>
                        <p className="text-3xl font-extrabold text-accent">PKR {product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-4 pt-4">
                        <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)}>
                            <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                            type="number"
                            value={quantity}
                            readOnly
                            className="w-16 text-center border-0 bg-transparent focus-visible:ring-0"
                            />
                            <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                            <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <Button size="lg" className="flex-grow rounded-full" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                        </div>

                         {inquiryLink && (
                          <>
                            <div className="flex items-center gap-4 my-2">
                                <Separator className="flex-1" />
                                <span className="text-xs text-muted-foreground">OR</span>
                                <Separator className="flex-1" />
                            </div>
                            <Button variant="outline" asChild className="w-full rounded-full">
                                <Link href={inquiryLink} target="_blank" rel="noopener noreferrer">
                                  {inquiryLogo && (
                                    <Image src={inquiryLogo} alt="Inquiry" width={20} height={20} className="mr-2 rounded-sm" data-ai-hint="chat logo"/>
                                  )}
                                  Contact for Details
                                </Link>
                            </Button>
                          </>
                        )}
                    </div>
                </div>
            </ScrollArea>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogContent>
     </Dialog>
  );
}
