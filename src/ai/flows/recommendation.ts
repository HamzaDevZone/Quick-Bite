'use server';
/**
 * @fileOverview An AI flow to suggest complementary items based on a given product.
 *
 * - suggestComplementaryItemsFlow - A function that suggests products.
 * - SuggestComplementaryItemsInput - The input type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';

// Define the input schema for the flow
const SuggestComplementaryItemsInputSchema = z.object({
  productName: z.string().describe('The name of the product to base recommendations on.'),
  category: z.string().describe('The category of the product.'),
});
export type SuggestComplementaryItemsInput = z.infer<typeof SuggestComplementaryItemsInputSchema>;

// Define a tool to get all available products from Firestore
const getAllProductsTool = ai.defineTool(
    {
        name: 'getAllProducts',
        description: 'Get a list of all available products from the store catalog.',
        inputSchema: z.object({}),
        outputSchema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            price: z.number(),
            category: z.string(),
            imageUrl: z.string(),
        })),
    },
    async () => {
        console.log('Fetching all products from Firestore...');
        const productsCollection = collection(db, 'products');
        const querySnapshot = await getDocs(productsCollection);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return products;
    }
);


// Define the main flow
export const suggestComplementaryItemsFlow = ai.defineFlow(
  {
    name: 'suggestComplementaryItemsFlow',
    inputSchema: SuggestComplementaryItemsInputSchema,
    outputSchema: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.string(),
        imageUrl: z.string(),
    })),
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-preview',
      tools: [getAllProductsTool],
      prompt: `
        You are a food recommendation expert for a delivery app called QuickBite.
        A user is currently looking at the product: "${input.productName}" which is in the "${input.category}" category.
        Your task is to suggest exactly TWO other items that would complement this product well.
        
        Follow these steps:
        1. Use the 'getAllProducts' tool to get the complete list of available products.
        2. From the list of all products, identify the best complementary items.
        3. Do NOT suggest the same product the user is already looking at.
        4. Do NOT suggest items from the exact same category unless it makes sense (e.g., different types of pizza). Prioritize items from different categories.
        5. Return a JSON array containing exactly two full product objects for the recommended items. Ensure the output is only the JSON array and nothing else.
      `,
      output: {
        format: 'json',
        schema: z.array(z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            price: z.number(),
            category: z.string(),
            imageUrl: z.string(),
        }))
      }
    });

    const products = llmResponse.output();
    if (!products) {
        return [];
    }
    return products;
  }
);
