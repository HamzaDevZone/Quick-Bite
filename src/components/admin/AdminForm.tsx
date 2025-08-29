
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Admin } from '@/lib/types';
import { useAdmins } from '@/hooks/use-admins';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').optional().or(z.literal('')),
});

interface AdminFormProps {
  adminToEdit?: Admin;
  setFormOpen: (open: boolean) => void;
}

export function AdminForm({ adminToEdit, setFormOpen }: AdminFormProps) {
  const { addAdmin, updateAdmin } = useAdmins();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (adminToEdit) {
      form.reset({
        ...adminToEdit,
        password: '', // Don't pre-fill password
      });
    } else {
        form.reset({
            name: '',
            email: '',
            password: '',
        });
    }
  }, [adminToEdit, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const submissionValues: any = { ...values };
    
    if (adminToEdit && !submissionValues.password) {
      delete submissionValues.password;
      updateAdmin({ ...adminToEdit, ...submissionValues });
    } else if (submissionValues.password && submissionValues.password.length >= 8) {
        if (adminToEdit) {
            updateAdmin({ ...adminToEdit, ...submissionValues });
        } else {
            addAdmin(submissionValues);
        }
    } else {
      form.setError("password", { type: "manual", message: adminToEdit ? "Password must be at least 8 characters." : "Password is required for new admins." });
      return;
    }
    
    setFormOpen(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder={adminToEdit ? 'Leave blank to keep current password' : 'Set a new password'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit">{adminToEdit ? 'Save Changes' : 'Add Admin'}</Button>
        </div>
      </form>
    </Form>
  );
}

    