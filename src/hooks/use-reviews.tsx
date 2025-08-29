
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
  // This provider is a bit complex for its purpose now.
  // The simplified hook `useReviews` below handles the logic more directly.
  // We can leave this provider here in case we need more complex, shared state later.
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
  const [state, setState] = useState<{
    reviews: Review[],
    loading: boolean,
  }>({
    reviews: [],
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchReviewsForProduct = async () => {
        setState(prevState => ({ ...prevState, loading: true }));
        try {
            // Simplified query to avoid composite index requirement
            const queryTarget = productId
                ? query(collection(db, 'reviews'), where('productId', '==', productId))
                : query(collection(db, 'reviews'), orderBy('createdAt', 'desc')); // For all reviews, we can keep the order

            const querySnapshot = await getDocs(queryTarget);
            if (isMounted) {
                let reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
                
                // Sort on the client-side if we filtered by productId
                if (productId) {
                   reviewsData.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
                }

                setState({ reviews: reviewsData, loading: false });
            }
        } catch (error) {
            console.error(`Error fetching reviews for product ${productId}: `, error);
            if (isMounted) {
                setState({ reviews: [], loading: false });
            }
        }
    };
    
    fetchReviewsForProduct();

    return () => {
        isMounted = false;
    };
  }, [productId]);


  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
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
          }
      ));

      toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
    } catch (error) {
      console.error("Error adding review: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your review.' });
    }
  };

  return { ...state, addReview };
};
