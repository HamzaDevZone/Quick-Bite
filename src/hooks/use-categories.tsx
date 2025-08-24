'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category } from '@/lib/types';
import { useToast } from './use-toast';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const querySnapshot = await getDocs(categoriesCollection);
      const categoriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch categories.' });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory = { ...category, id: category.name.toLowerCase().replace(/\s+/g, '-') };
      const docRef = await addDoc(collection(db, 'categories'), newCategory);
      setCategories(prevCategories => [{ ...newCategory, id: docRef.id }, ...prevCategories]);
      toast({ title: 'Category Added', description: `${category.name} has been successfully added.` });
    } catch (error) {
      console.error("Error adding category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add category.' });
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
     try {
      const categoryDoc = doc(db, 'categories', updatedCategory.id);
      await updateDoc(categoryDoc, updatedCategory);
      setCategories(prevCategories =>
        prevCategories.map(c => (c.id === updatedCategory.id ? updatedCategory : c))
      );
      toast({ title: 'Category Updated', description: `${updatedCategory.name} has been successfully updated.` });
    } catch (error)
    {
      console.error("Error updating category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update category.' });
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
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
