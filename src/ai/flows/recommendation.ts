
'use server';
/**
 * @fileOverview A flow for suggesting complementary items.
 *
 * - suggestComplementaryItemsFlow - A function that suggests items based on a given product.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {PRODUCTS} from '@/lib/data';
import type {Product} from '@/lib/types';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  imageUrl: z.string(),
});

const SuggestComplementaryItemsInputSchema = z.object({
  productName: z.string(),
  category: z.string(),
});

const SuggestComplementaryItemsOutputSchema = z.array(z.string()).describe("A list of product names that are complementary to the input product.");

const allProductNames = PRODUCTS.map(p => p.name).join(', ');

const prompt = ai.definePrompt({
    name: 'suggestComplementaryItemsPrompt',
    input: { schema: SuggestComplementaryItemsInputSchema },
    output: { schema: SuggestComplementaryItemsOutputSchema },
    prompt: `You are a food recommendation expert for a delivery app.
    Given a product, suggest two other items from the menu that would complement it well.
    For example, for a burger, you might suggest fries and a coke. For a pizza, you might suggest onion rings and a sprite.

    Here are all the available products on the menu:
    ${allProductNames}

    Current Product:
    Name: {{{productName}}}
    Category: {{{category}}}

    Suggest exactly two complementary product names from the available list. Only return the names in the output array.
    `,
});


export const suggestComplementaryItemsFlow = ai.defineFlow(
  {
    name: 'suggestComplementaryItemsFlow',
    inputSchema: SuggestComplementaryItemsInputSchema,
    outputSchema: z.array(ProductSchema),
  },
  async ({ productName, category }) => {
    
    // In a real app, you'd fetch products from your database here.
    const allProducts = PRODUCTS;
    const allProductNames = allProducts.map(p => p.name).join(', ');

    const llmResponse = await prompt({ productName, category });
    const recommendedProductNames = llmResponse.output || [];

    // Filter the main product list to get the full product objects
    const recommendedProducts = allProducts.filter(p => recommendedProductNames.includes(p.name));
    
    return recommendedProducts;
  }
);
