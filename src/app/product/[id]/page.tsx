
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './ProductDetailClient';

// This page will now be rendered dynamically on-demand.
// This is the correct approach for a dynamic app using a live database.
export const dynamic = 'force-dynamic';

async function getProduct(id: string): Promise<Product | null> {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        }
        return null;
    } catch (error) {
        console.error("Error fetching product in Page component", error);
        return null;
    }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
