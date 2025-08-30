
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, writeBatch, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MainCategory, SubCategory } from '@/lib/types';
import { useToast } from './use-toast';

interface CategoryContextType {
  mainCategories: MainCategory[];
  subCategories: SubCategory[];
  addMainCategory: (category: Omit<MainCategory, 'id'>) => Promise<void>;
  updateMainCategory: (categoryId: string, data: Omit<MainCategory, 'id'>) => Promise<void>;
  deleteMainCategory: (categoryId: string) => Promise<void>;
  addSubCategory: (category: Omit<SubCategory, 'id'>) => Promise<void>;
  updateSubCategory: (categoryId: string, data: Omit<SubCategory, 'id'>) => Promise<void>;
  deleteSubCategory: (categoryId: string) => Promise<void>;
  loading: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const mainCatQuery = query(collection(db, 'main_categories'), orderBy('name'));
    const subCatQuery = query(collection(db, 'sub_categories'), orderBy('name'));

    const unsubMain = onSnapshot(mainCatQuery, (querySnapshot) => {
      const mainCatData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MainCategory));
      setMainCategories(mainCatData);
    }, (error) => {
      console.error("Error fetching main categories: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch main categories.' });
    });

    const unsubSub = onSnapshot(subCatQuery, (querySnapshot) => {
      const subCatData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubCategory));
      setSubCategories(subCatData);
       if(loading) setLoading(false);
    }, (error) => {
      console.error("Error fetching sub categories: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch sub categories.' });
       if(loading) setLoading(false);
    });


    return () => {
      unsubMain();
      unsubSub();
    };
  }, [toast]);

  const addMainCategory = useCallback(async (category: Omit<MainCategory, 'id'>) => {
    try {
      await addDoc(collection(db, 'main_categories'), category);
      toast({ title: 'Main Category Added', description: `${category.name} has been successfully added.` });
    } catch (error) {
      console.error("Error adding main category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add main category.' });
    }
  }, [toast]);

  const updateMainCategory = useCallback(async (categoryId: string, data: Omit<MainCategory, 'id'>) => {
     try {
      const categoryDoc = doc(db, 'main_categories', categoryId);
      await updateDoc(categoryDoc, data);
      toast({ title: 'Main Category Updated', description: `${data.name} has been successfully updated.` });
    } catch (error) {
      console.error("Error updating main category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update main category.' });
    }
  }, [toast]);

  const deleteMainCategory = useCallback(async (categoryId: string) => {
    const batch = writeBatch(db);
    try {
      // Delete main category
      const mainCatDoc = doc(db, 'main_categories', categoryId);
      batch.delete(mainCatDoc);

      // Find and delete all sub-categories
      const subCatQuery = query(collection(db, 'sub_categories'), where('mainCategoryId', '==', categoryId));
      const subCatSnapshot = await getDocs(subCatQuery);
      subCatSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      toast({ variant: 'destructive', title: 'Main Category Deleted', description: 'The category and its sub-categories have been deleted.' });
    } catch (error) {
      console.error("Error deleting main category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the main category.' });
    }
  }, [toast]);

  const addSubCategory = useCallback(async (category: Omit<SubCategory, 'id'>) => {
    try {
      await addDoc(collection(db, 'sub_categories'), category);
      toast({ title: 'Sub Category Added', description: `${category.name} has been successfully added.` });
    } catch (error) {
      console.error("Error adding sub category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add sub category.' });
    }
  }, [toast]);

  const updateSubCategory = useCallback(async (categoryId: string, data: Omit<SubCategory, 'id'>) => {
     try {
      const categoryDoc = doc(db, 'sub_categories', categoryId);
      await updateDoc(categoryDoc, data);
      toast({ title: 'Sub Category Updated', description: `${data.name} has been successfully updated.` });
    } catch (error) {
      console.error("Error updating sub category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update sub category.' });
    }
  }, [toast]);

  const deleteSubCategory = useCallback(async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'sub_categories', categoryId));
      toast({ variant: 'destructive', title: 'Sub Category Deleted', description: 'The sub category has been deleted.' });
    } catch (error) {
      console.error("Error deleting sub category: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete sub category.' });
    }
  }, [toast]);

  return (
    <CategoryContext.Provider value={{ mainCategories, subCategories, addMainCategory, updateMainCategory, deleteMainCategory, addSubCategory, updateSubCategory, deleteSubCategory, loading }}>
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
