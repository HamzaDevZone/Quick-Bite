'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where, Timestamp, orderBy } from 'firebase/firestore';
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
  const [allReviews, setAllReviews] = useState<Record<string, Review[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const fetchReviews = async (productId: string) => {
    if (!productId || allReviews[productId]) return;

    setLoadingStates(prev => ({ ...prev, [productId]: true }));
    try {
      const reviewsCollection = collection(db, 'reviews');
      const q = query(reviewsCollection, where('productId', '==', productId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      
      setAllReviews(prev => ({ ...prev, [productId]: reviewsData }));
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}: `, error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch reviews.' });
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      const newReviewData = {
        ...review,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'reviews'), newReviewData);
      const newReview = { ...newReviewData, id: docRef.id } as Review;

      setAllReviews(prev => {
        const productReviews = prev[review.productId] ? [newReview, ...prev[review.productId]] : [newReview];
        return { ...prev, [review.productId]: productReviews };
      });
      toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
    } catch (error) {
      console.error("Error adding review: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your review.' });
    }
  };
  
  // This value will be passed to consumers
  const contextValue = {
    allReviews,
    loadingStates,
    fetchReviews,
    addReview
  };

  // Dummy context provider to satisfy the type. The real logic is in useReviews hook.
  const dummyContext: ReviewContextType = {
    reviews: [],
    addReview: async () => {},
    loading: true,
  }

  // We are not using the context provider in a traditional way.
  // The state is managed here, but consumed via a custom hook `useReviews` that gets productId.
  // This is a pattern to manage sliced state.
  return <ReviewContext.Provider value={dummyContext}>{children}</ReviewContext.Provider>;
};

// This is the hook that components will use.
export const useReviews = (productId: string) => {
  const context = useContext(ReviewContext);
  // The context is a bit of a hack in this pattern, so we grab the real state manager from the provider.
  // In a real app, you might use a more robust state management library like Zustand or Redux.
  const [state, setState] = useState<{
    reviews: Review[],
    loading: boolean,
    addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>,
  }>({
    reviews: [],
    loading: true,
    addReview: async () => {}
  });

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;
    const fetchReviewsForProduct = async () => {
        try {
            const reviewsCollection = collection(db, 'reviews');
            const q = query(reviewsCollection, where('productId', '==', productId), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            if (isMounted) {
                const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
                setState(prevState => ({ ...prevState, reviews: reviewsData, loading: false }));
            }
        } catch (error) {
            console.error(`Error fetching reviews for product ${productId}: `, error);
            if (isMounted) {
                setState(prevState => ({ ...prevState, loading: false }));
            }
        }
    };
    
    fetchReviewsForProduct();

    return () => {
        isMounted = false;
    };
  }, [productId]);


  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    const { toast } = useToast();
    try {
      const newReviewData = {
        ...review,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, 'reviews'), newReviewData);
      const newReview = { ...newReviewData, id: docRef.id } as Review;
      
      setState(prevState => ({
          ...prevState,
          reviews: [newReview, ...prevState.reviews]
      }))

      toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
    } catch (error) {
      console.error("Error adding review: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your review.' });
    }
  };

  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }

  return { ...state, addReview };
};
