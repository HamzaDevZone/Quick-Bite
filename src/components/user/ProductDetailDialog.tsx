
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { Minus, Plus, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useReviews } from '@/hooks/use-reviews';
import { ReviewForm } from '@/components/user/ReviewForm';
import { StarRating } from '@/components/user/StarRating';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';


interface ProductDetailDialogProps {
    product: Product;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({ product, isOpen, onOpenChange }: ProductDetailDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const { reviews, loading: reviewsLoading } = useReviews(product.id);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onOpenChange(false); // Close dialog after adding to cart
  };

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
     <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle className="sr-only">{product.name}</DialogTitle>
                <DialogDescription className="sr-only">{product.description}</DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-8 flex-grow overflow-hidden">
                {/* Left side: Image and details */}
                <div className="flex flex-col gap-4">
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
                        <div className="flex items-center gap-2">
                            <StarRating rating={averageRating} readOnly />
                            <span className="text-muted-foreground">({reviews.length} reviews)</span>
                        </div>
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
                    </div>
                </div>

                {/* Right side: Reviews */}
                <ScrollArea className="h-full">
                <div className="pr-4">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-2xl font-bold font-headline mb-4">Leave a Review</h2>
                            <ReviewForm productId={product.id} />
                        </div>
                        <Separator />
                        <div>
                            <h2 className="text-2xl font-bold font-headline mb-4">What others are saying</h2>
                            {reviewsLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-24 w-full" />
                                </div>
                            ) : reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review.id} className="flex gap-4 p-3 rounded-lg bg-secondary">
                                        <Avatar>
                                                <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold">{review.customerName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(review.createdAt.toDate(), 'PPP')}
                                                    </p>
                                                </div>
                                                <StarRating rating={review.rating} readOnly size={16} />
                                                <p className="mt-2 text-sm text-muted-foreground">{review.feedback}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm text-center py-8">No reviews yet. Be the first one to review!</p>
                            )}
                        </div>
                    </div>
                </div>
                </ScrollArea>
            </div>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogContent>
     </Dialog>
  );
}
