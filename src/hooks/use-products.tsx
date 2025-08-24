'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
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

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const querySnapshot = await getDocs(productsCollection);
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch products.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), product);
      setProducts(prevProducts => [{ ...product, id: docRef.id }, ...prevProducts]);
      toast({ title: 'Product Added', description: `${product.name} has been successfully added.` });
    } catch (error) {
      console.error("Error adding product: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add product.' });
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const productDoc = doc(db, 'products', updatedProduct.id);
      await updateDoc(productDoc, updatedProduct);
      setProducts(prevProducts =>
        prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      toast({ title: 'Product Updated', description: `${updatedProduct.name} has been successfully updated.` });
    } catch (error) {
      console.error("Error updating product: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update product.' });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
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
