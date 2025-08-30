
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MainCategory, SubCategory } from '@/lib/types';
import { useCategories } from '@/hooks/use-categories';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export type FormType = 'main' | 'sub';

const mainCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
});

const subCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  iconUrl: z.string().url('Please enter a valid URL.'),
  mainCategoryId: z.string({ required_error: 'Please select a main category.' }),
});

interface CategoryFormProps {
  formType: FormType;
  categoryToEdit?: MainCategory | SubCategory;
  setFormOpen: (open: boolean) => void;
  mainCategories?: MainCategory[];
  preselectedMainCategoryId?: string | null;
}

export function CategoryForm({
  formType,
  categoryToEdit,
  setFormOpen,
  mainCategories = [],
  preselectedMainCategoryId = null
}: CategoryFormProps) {
  const { addMainCategory, updateMainCategory, addSubCategory, updateSubCategory } = useCategories();
  
  const isMain = formType === 'main';
  const schema = isMain ? mainCategorySchema : subCategorySchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isMain 
        ? { name: '' } 
        : { name: '', iconUrl: '', mainCategoryId: preselectedMainCategoryId || '' },
  });

  useEffect(() => {
    if (categoryToEdit) {
      form.reset(categoryToEdit);
    } else {
      form.reset(
        isMain
          ? { name: '' }
          : { name: '', iconUrl: '', mainCategoryId: preselectedMainCategoryId || '' }
      );
    }
  }, [categoryToEdit, form, isMain, preselectedMainCategoryId]);

  function onSubmit(values: z.infer<typeof schema>) {
    if (isMain) {
      if (categoryToEdit) {
        updateMainCategory(categoryToEdit.id, values as Omit<MainCategory, 'id'>);
      } else {
        addMainCategory(values as Omit<MainCategory, 'id'>);
      }
    } else { // It's a sub-category
      if (categoryToEdit) {
        updateSubCategory(categoryToEdit.id, values as Omit<SubCategory, 'id'>);
      } else {
        addSubCategory(values as Omit<SubCategory, 'id'>);
      }
    }
    setFormOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isMain && (
          <FormField
            control={form.control}
            name="mainCategoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a main category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mainCategories.map(mc => (
                      <SelectItem key={mc.id} value={mc.id}>{mc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder={isMain ? "e.g. Food" : "e.g. Pizza"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isMain && (
          <FormField
            control={form.control}
            name="iconUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/icon.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit">{categoryToEdit ? 'Save Changes' : 'Add Category'}</Button>
        </div>
      </form>
    </Form>
  );
}
