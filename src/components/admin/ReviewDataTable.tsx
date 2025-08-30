'use client';

import { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Review, Product } from '@/lib/types';
import { StarRating } from '@/components/user/StarRating';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { useProducts } from '@/hooks/use-products';

interface ReviewWithId extends Review {
    id: string;
}

interface ReviewDataTableProps {
  data: ReviewWithId[];
}

// This component is simpler now as we don't link to a separate product page.
const ProductCell = ({ productId, productsMap }: { productId: string, productsMap: Map<string, Product> }) => {
    const productName = productsMap.get(productId)?.name || 'Product not found';

    return (
        <span>{productName}</span>
    );
};


export function ReviewDataTable({ data }: ReviewDataTableProps) {
  const { products, loading: productsLoading } = useProducts();

  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach(product => {
      map.set(product.id, product);
    });
    return map;
  }, [products]);

  return (
    <div className="rounded-md border bg-card">
      <ScrollArea className="w-full whitespace-nowrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsLoading ? (
                <TableRow>
                    <TableCell colSpan={5}>
                        <div className="flex items-center justify-center p-8">
                             <p>Loading review data...</p>
                        </div>
                    </TableCell>
                </TableRow>
            ) : data.length > 0 ? (
                data.map(review => (
                <TableRow key={review.id}>
                    <TableCell className="font-medium">
                        <ProductCell productId={review.productId} productsMap={productsMap} />
                    </TableCell>
                    <TableCell>{review.customerName}</TableCell>
                    <TableCell>
                        <StarRating rating={review.rating} readOnly size={18} />
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal break-words">{review.feedback}</TableCell>
                    <TableCell>{format(review.createdAt.toDate(), 'PPP')}</TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No reviews found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
