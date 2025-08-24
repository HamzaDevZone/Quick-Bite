'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Rider } from '@/lib/types';
import { useRiders } from '@/hooks/use-riders';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').optional().or(z.literal('')),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  vehicleInfo: z.string().min(3, 'Vehicle info must be at least 3 characters.'),
  profilePictureUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

interface RiderFormProps {
  riderToEdit?: Rider;
  setFormOpen: (open: boolean) => void;
}

export function RiderForm({ riderToEdit, setFormOpen }: RiderFormProps) {
  const { addRider, updateRider } = useRiders();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      vehicleInfo: '',
      profilePictureUrl: '',
    },
  });

  useEffect(() => {
    if (riderToEdit) {
      form.reset({
        ...riderToEdit,
        password: '', // Don't pre-fill password for editing
      });
    }
  }, [riderToEdit, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const submissionValues: any = { ...values };
    
    // Do not update password if it's not provided during edit
    if (riderToEdit && !submissionValues.password) {
      delete submissionValues.password;
    }

    if (riderToEdit) {
      updateRider({ ...riderToEdit, ...submissionValues });
    } else {
      addRider(submissionValues);
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
                <Input placeholder="Alex Green" {...field} />
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
                <Input type="email" placeholder="rider@example.com" {...field} />
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
                <Input type="password" placeholder={riderToEdit ? 'Leave blank to keep current password' : 'Set a new password'} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Info</FormLabel>
              <FormControl>
                <Input placeholder="Motorcycle - ABC 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profilePictureUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit">{riderToEdit ? 'Save Changes' : 'Add Rider'}</Button>
        </div>
      </form>
    </Form>
  );
}
