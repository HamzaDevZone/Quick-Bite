import { ai } from '../genkit';
import { defineFlow } from 'genkit/flow';
import { z } from 'zod';
import { PRODUCTS } from '@/lib/data';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  imageUrl: z.string(),
});

export const suggestComplementaryItemsFlow = defineFlow(
  {
    name: 'suggestComplementaryItemsFlow',
    inputSchema: z.object({
      productName: z.string(),
      category: z.string(),
    }),
    outputSchema: z.array(ProductSchema),
  },
  async ({ productName, category }) => {
    // This is a mock implementation. A real implementation would use a generative model.
    console.log(`Finding recommendations for ${productName} in category ${category}`);
    
    let recommendations: string[] = [];
    if (category.toLowerCase() === 'burgers') {
      recommendations = ['Crispy French Fries', 'Coca-Cola'];
    } else if (category.toLowerCase() === 'pizza') {
      recommendations = ['Onion Rings', 'Sprite'];
    } else {
      recommendations = ['Crispy French Fries', 'Coca-Cola'];
    }

    const recommendedProducts = PRODUCTS.filter(p => recommendations.includes(p.name));
    
    return recommendedProducts;
  }
);
