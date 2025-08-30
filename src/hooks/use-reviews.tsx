
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Review } from '@/lib/types';
import { useToast } from './use-toast';

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  loading: boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const addReview = async () => {
    console.warn("addReview from provider is not implemented, use the one from the hook.");
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview, loading }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = (productId: string | null) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId && productId !== null) {
        setLoading(false);
        setReviews([]);
        return;
    }

    setLoading(true);
    const reviewsCollection = collection(db, 'reviews');
    
    // If productId is null, fetch all reviews sorted by date.
    // If productId is provided, filter by it. Sorting will be done client-side to avoid composite index.
    const q = productId 
              ? query(reviewsCollection, where('productId', '==', productId))
              : query(reviewsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
        
        // Sort client-side if we filtered by productId
        if (productId) {
            reviewsData.sort((a, b) => {
                const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
                const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
                return dateB - dateA;
            });
        }
        
        setReviews(reviewsData);
        setLoading(false);
    }, (error) => {
        console.error(`Error fetching reviews: `, error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch reviews.' });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [productId, toast]);


  const addReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      const newReviewData = {
        ...review,
        createdAt: Timestamp.now(),
      };
      await addDoc(collection(db, 'reviews'), newReviewData);
      toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
    } catch (error) {
      console.error("Error adding review: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your review.' });
    }
  }, [toast]);

  return { reviews, loading, addReview };
};
