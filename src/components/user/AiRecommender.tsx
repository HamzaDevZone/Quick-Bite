'use client';

import { useEffect, useState } from 'react';
import { Wand2 } from 'lucide-react';
import { getRecommendations } from '@/app/actions';
import type { Product } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { ProductCard } from './ProductCard';

interface AiRecommenderProps {
  currentProduct: Product;
}

export default function AiRecommender({ currentProduct }: AiRecommenderProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const result = await getRecommendations(currentProduct);
        setRecommendations(result);
      } catch (err) {
        setError('Could not fetch recommendations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct]);

  return (
    <div className="mt-12 p-6 rounded-lg bg-secondary border border-border">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-accent">
        <Wand2 />
        AI Recommendations
      </h3>
      <p className="text-muted-foreground mb-6">
        Customers who bought this also bought:
      </p>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}
      {error && <p className="text-destructive">{error}</p>}
      {!loading && !error && recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
