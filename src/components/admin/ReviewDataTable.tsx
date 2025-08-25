
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Review, Product } from '@/lib/types';
import { StarRating } from '@/components/user/StarRating';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';

interface ReviewDataTableProps {
  data: Review[];
}

const ProductCell = ({ productId }: { productId: string }) => {
    const [productName, setProductName] = useState('Loading...');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', productId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProductName((docSnap.data() as Product).name);
                } else {
                    setProductName('Product not found');
                }
            } catch {
                setProductName('Error loading product');
            }
        };
        fetchProduct();
    }, [productId]);

    return (
        <Link href={`/product/${productId}`} className="text-primary hover:underline" target="_blank">
            {productName}
        </Link>
    );
};


export function ReviewDataTable({ data }: ReviewDataTableProps) {

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
            {data.map(review => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                    <ProductCell productId={review.productId} />
                </TableCell>
                <TableCell>{review.customerName}</TableCell>
                <TableCell>
                    <StarRating rating={review.rating} readOnly size={18} />
                </TableCell>
                <TableCell className="max-w-sm whitespace-normal">{review.feedback}</TableCell>
                <TableCell>{format(review.createdAt.toDate(), 'PPP')}</TableCell>
              </TableRow>
            ))}
             {data.length === 0 && (
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
