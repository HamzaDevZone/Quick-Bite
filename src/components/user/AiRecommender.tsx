
'use client';

import { useEffect, useState } from 'react';
import { suggestComplementaryItemsFlow } from '@/ai/flows/recommendation';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface AiRecommenderProps {
  product: Product;
}

export function AiRecommender({ product }: AiRecommenderProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecommendations = async () => {
      setLoading(true);
      try {
        const result = await suggestComplementaryItemsFlow({ 
            productName: product.name,
            category: product.category 
        });
        setRecommendations(result);
      } catch (error) {
        console.error("Failed to get AI recommendations:", error);
        // Set recommendations to empty array on error to avoid crash
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [product]);

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold font-headline mb-6 flex items-center gap-2">
        <Wand2 className="h-8 w-8 text-primary" />
        <span>You Might Also Like</span>
      </h2>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <CardSkeleton />
            <CardSkeleton />
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {recommendations.map(recProduct => (
            <ProductCard key={recProduct.id} product={recProduct} />
          ))}
        </div>
      ) : null}
    </div>
  );
}


const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[192px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
     <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-6 w-1/4" />
       <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);
