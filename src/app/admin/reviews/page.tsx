
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Review } from '@/lib/types';
import { ReviewDataTable } from '@/components/admin/ReviewDataTable';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewWithId extends Review {
    id: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<ReviewWithId[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const reviewsCollection = collection(db, 'reviews');
                const q = query(reviewsCollection, orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewWithId));
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                // Optionally show a toast message here
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-headline">Customer Reviews</h1>
            </div>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : (
                <ReviewDataTable data={reviews} />
            )}
        </div>
    );
}
