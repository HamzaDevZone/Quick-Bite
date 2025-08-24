'use server';
import { run } from '@genkit-ai/next/server';
import { suggestComplementaryItemsFlow } from '@/ai/flows/recommendation';
import type { Product } from '@/lib/types';

export async function getRecommendations(product: Product) {
  const result = await run(suggestComplementaryItemsFlow, {
    productName: product.name,
    category: product.category,
  });

  return result;
}
