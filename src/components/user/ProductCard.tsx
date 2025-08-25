
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/product/${product.id}`} className="group">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 border-secondary bg-secondary/50 hover:bg-secondary">
        <CardHeader className="p-0">
          <div className="relative w-full aspect-square">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="food item"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
            <CardTitle className="text-lg font-bold mb-1 leading-tight text-foreground">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground flex-grow line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">PKR {product.price.toFixed(2)}</span>
          <Button size="icon" variant="ghost" className="rounded-full text-primary hover:bg-primary/20 hover:text-primary" onClick={handleAddToCart}>
            <PlusCircle className="h-8 w-8" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
