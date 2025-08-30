
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';
import { useToast } from './use-toast';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const productsCollection = collection(db, 'products');
    // Using onSnapshot for real-time updates
    const q = query(productsCollection, orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products in real-time: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch products.' });
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);


  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), product);
      toast({ title: 'Product Added', description: `${product.name} has been successfully added.` });
      // No need to setProducts here, onSnapshot will handle it
    } catch (error) {
      console.error("Error adding product: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add product.' });
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const productDoc = doc(db, 'products', updatedProduct.id);
      // Exclude id from the data being sent to Firestore
      const { id, ...productData } = updatedProduct;
      await updateDoc(productDoc, productData);
      toast({ title: 'Product Updated', description: `${updatedProduct.name} has been successfully updated.` });
    } catch (error) {
      console.error("Error updating product: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update product.' });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      toast({ variant: 'destructive', title: 'Product Deleted', description: 'The product has been successfully deleted.' });
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete product.' });
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
