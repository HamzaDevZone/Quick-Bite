
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
    
    // If productId is null, we fetch all reviews. Otherwise, we filter by productId.
    const q = productId 
              ? query(reviewsCollection, where('productId', '==', productId), orderBy('createdAt', 'desc'))
              : query(reviewsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
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
