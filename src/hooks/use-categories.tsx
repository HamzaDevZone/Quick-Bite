
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category } from '@/lib/types';
import { useToast } from './use-toast';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (categoryId: string, data: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const categoriesCollection = collection(db, 'categories');
    const q = query(categoriesCollection, orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(categoriesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching categories: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch categories.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await addDoc(collection(db, 'categories'), category);
      toast({ title: 'Category Added', description: `${category.name} has been successfully added.` });
    } catch (error) {
      console.error("Error adding category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add category.' });
    }
  };

  const updateCategory = async (categoryId: string, data: Omit<Category, 'id'>) => {
     try {
      const categoryDoc = doc(db, 'categories', categoryId);
      await updateDoc(categoryDoc, data);
      toast({ title: 'Category Updated', description: `${data.name} has been successfully updated.` });
    } catch (error)
    {
      console.error("Error updating category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update category.' });
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      toast({ variant: 'destructive', title: 'Category Deleted', description: 'The category has been successfully deleted.' });
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete category.' });
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
