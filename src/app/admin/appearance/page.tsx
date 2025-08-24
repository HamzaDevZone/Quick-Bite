'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useEffect } from 'react';

const appearanceFormSchema = z.object({
  heroImageUrl: z.string().url('Please enter a valid URL.'),
  splashImageUrl: z.string().url('Please enter a valid URL.'),
  menuImageUrl: z.string().url('Please enter a valid URL.'),
  deliveryFee: z.coerce.number().min(0, 'Delivery fee cannot be negative.'),
});

export default function AdminAppearancePage() {
  const { settings, updateSettings } = useSiteSettings();

  const form = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      heroImageUrl: settings.heroImageUrl,
      splashImageUrl: settings.splashImageUrl,
      menuImageUrl: settings.menuImageUrl,
      deliveryFee: settings.deliveryFee,
    },
  });
  
  useEffect(() => {
    form.reset({ 
      heroImageUrl: settings.heroImageUrl,
      splashImageUrl: settings.splashImageUrl,
      menuImageUrl: settings.menuImageUrl,
      deliveryFee: settings.deliveryFee,
    });
  }, [settings, form]);

  function onSubmit(values: z.infer<typeof appearanceFormSchema>) {
    updateSettings(values);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Appearance & General</h1>
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>Customize the look and feel of your customer-facing app.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Page Hero Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-image.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="splashImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Splash Screen Background URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/splash-bg.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="menuImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu Page Header Background URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/menu-bg.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Fee (PKR)</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
