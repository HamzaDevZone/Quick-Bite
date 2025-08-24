'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/data';
import { useToast } from './use-toast';

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: category.name.toLowerCase().replace(/\s+/g, '-') };
    setCategories(prevCategories => [newCategory, ...prevCategories]);
    toast({ title: 'Category Added', description: `${category.name} has been successfully added.` });
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prevCategories =>
      prevCategories.map(c => (c.id === updatedCategory.id ? updatedCategory : c))
    );
    toast({ title: 'Category Updated', description: `${updatedCategory.name} has been successfully updated.` });
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
    toast({ variant: 'destructive', title: 'Category Deleted', description: 'The category has been successfully deleted.' });
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
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
