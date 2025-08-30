
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Category, ServiceType, serviceTypes } from '@/lib/types';
import { useCategories } from '@/hooks/use-categories';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  iconUrl: z.string().url('Please enter a valid URL.'),
  serviceType: z.enum(serviceTypes, { required_error: 'Please select a service type.'}),
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
      serviceType: 'Food',
    },
  });

  useEffect(() => {
    if (categoryToEdit) {
      form.reset(categoryToEdit);
    } else {
        form.reset({
            name: '',
            iconUrl: '',
            serviceType: 'Food'
        });
    }
  }, [categoryToEdit, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (categoryToEdit) {
      // Use the actual document ID from the prop for updating
      updateCategory(categoryToEdit.id, values);
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
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {serviceTypes.map(type => (
                     <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
