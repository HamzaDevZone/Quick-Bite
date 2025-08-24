'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Category } from '@/lib/types';
import { useCategories } from '@/hooks/use-categories';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  iconUrl: z.string().url('Please enter a valid URL.'),
});

interface CategoryFormProps {
  categoryToEdit?: Category;
  setFormOpen: (open: boolean) => void;
}

export function CategoryForm({ categoryToEdit, setFormOpen }: CategoryFormProps) {
  const { addCategory, updateCategory } = useCategories();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      iconUrl: '',
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      form.reset(categoryToEdit);
    }
  }, [categoryToEdit, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (categoryToEdit) {
      updateCategory({ ...categoryToEdit, ...values });
    } else {
      addCategory(values);
    }
    setFormOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Pizza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit">{categoryToEdit ? 'Save Changes' : 'Add Category'}</Button>
        </div>
      </form>
    </Form>
  );
}
