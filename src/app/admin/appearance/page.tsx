
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
import { Separator } from '@/components/ui/separator';

const appearanceFormSchema = z.object({
  heroImageUrl: z.string().url('Please enter a valid URL.'),
  menuImageUrl: z.string().url('Please enter a valid URL.'),
  deliveryFee: z.coerce.number().min(0, 'Delivery fee cannot be negative.'),
  menuCarouselImage1: z.string().url('Please enter a valid URL.'),
  menuCarouselImage2: z.string().url('Please enter a valid URL.'),
  menuCarouselImage3: z.string().url('Please enter a valid URL.'),
  menuCarouselImage4: z.string().url('Please enter a valid URL.'),
  whatsappUrl: z.string().url('Please enter a valid WhatsApp URL.').optional().or(z.literal('')),
  facebookUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  instagramUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  productInquiryLink: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  productInquiryLogoUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

export default function AdminAppearancePage() {
  const { settings, updateSettings, isLoading } = useSiteSettings();

  const form = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: settings,
  });
  
  useEffect(() => {
    if (!isLoading && settings) {
        form.reset(settings);
    }
  }, [settings, isLoading, form]);

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
                name="menuImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu Page Header Background URL (Not currently used)</FormLabel>
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
              <Separator />
                <h3 className="text-lg font-medium pt-4">Menu Page Carousel</h3>
                 <FormField
                control={form.control}
                name="menuCarouselImage1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carousel Image 1 URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/carousel-1.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                 <FormField
                control={form.control}
                name="menuCarouselImage2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carousel Image 2 URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/carousel-2.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                 <FormField
                control={form.control}
                name="menuCarouselImage3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carousel Image 3 URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/carousel-3.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                 <FormField
                control={form.control}
                name="menuCarouselImage4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carousel Image 4 URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/carousel-4.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <h3 className="text-lg font-medium pt-4">Contact & Social Media Links</h3>
              <FormField
                control={form.control}
                name="whatsappUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant WhatsApp URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://wa.me/923001234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer's Facebook Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/your-page" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer's Instagram Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/your-profile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <h3 className="text-lg font-medium pt-4">Product Inquiry</h3>
               <FormField
                control={form.control}
                name="productInquiryLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Inquiry Link</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. https://wa.me/your-number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="productInquiryLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Inquiry Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. https://example.com/logo.png" {...field} />
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
