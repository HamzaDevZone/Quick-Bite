
'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserHeader } from '@/components/user/Header';
import { useCart } from '@/hooks/use-cart';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AiRecommender } from '@/components/user/AiRecommender';

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching product", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
       <div className="min-h-screen flex flex-col">
          <UserHeader />
          <main className="flex-grow container mx-auto px-4 py-12">
              <Skeleton className="h-10 w-36 mb-8" />
              <div className="grid md:grid-cols-2 gap-12 items-start">
                  <Skeleton className="aspect-square rounded-lg" />
                  <div className="flex flex-col gap-6">
                      <Skeleton className="h-12 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-12 w-1/3" />
                      <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-32 rounded-md" />
                          <Skeleton className="h-12 flex-grow rounded-full" />
                      </div>
                  </div>
              </div>
          </main>
      </div>
    )
  }

  if (!product) {
    notFound();
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
         <Button variant="ghost" onClick={() => router.back()} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
        </Button>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-105"
              data-ai-hint="food item detail"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold font-headline text-primary">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>
            <p className="text-4xl font-extrabold text-accent">PKR {product.price.toFixed(2)}</p>
            <div className="flex items-center gap-4">
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
              <Button size="lg" className="flex-grow rounded-full" onClick={() => addToCart(product, quantity)}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        <AiRecommender product={product} />
      </main>
    </div>
  );
}
