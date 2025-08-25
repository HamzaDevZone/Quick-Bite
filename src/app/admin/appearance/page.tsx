
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useEffect, useState } from 'react';
import { sendTestNotification } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bell, Trash2, PlusCircle, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { PaymentMethod } from '@/lib/types';

const appearanceFormSchema = z.object({
  heroImageUrl: z.string().url('Please enter a valid URL.'),
  splashImageUrl: z.string().url('Please enter a valid URL.'),
  splashLogoUrl: z.string().url('Please enter a valid URL.'),
  menuImageUrl: z.string().url('Please enter a valid URL.'),
  deliveryFee: z.coerce.number().min(0, 'Delivery fee cannot be negative.'),
  menuCarouselImage1: z.string().url('Please enter a valid URL.'),
  menuCarouselImage2: z.string().url('Please enter a valid URL.'),
  menuCarouselImage3: z.string().url('Please enter a valid URL.'),
  menuCarouselImage4: z.string().url('Please enter a valid URL.'),
});

export default function AdminAppearancePage() {
  const { settings, updateSettings } = useSiteSettings();
  const { toast } = useToast();
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const form = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: settings,
  });
  
  useEffect(() => {
    if (settings) {
        form.reset({
            heroImageUrl: settings.heroImageUrl,
            splashImageUrl: settings.splashImageUrl,
            splashLogoUrl: settings.splashLogoUrl,
            menuImageUrl: settings.menuImageUrl,
            deliveryFee: settings.deliveryFee,
            menuCarouselImage1: settings.menuCarouselImage1,
            menuCarouselImage2: settings.menuCarouselImage2,
            menuCarouselImage3: settings.menuCarouselImage3,
            menuCarouselImage4: settings.menuCarouselImage4,
        });
    }
  }, [settings, form]);

  function onSubmit(values: z.infer<typeof appearanceFormSchema>) {
    updateSettings(values);
  }

  const handleSendTestNotification = async () => {
    toast({ title: 'Sending...', description: 'Sending a test notification to all subscribed users.' });
    const result = await sendTestNotification();
     if (result.success) {
      toast({ title: 'Success', description: result.message });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  }

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.trim() === '') {
      toast({ variant: 'destructive', title: 'Error', description: 'Payment method name cannot be empty.'});
      return;
    }
    const newMethod: PaymentMethod = {
      value: newPaymentMethod.trim(),
      label: newPaymentMethod.trim(),
    };
    const updatedMethods = [...(settings.paymentMethods || []), newMethod];
    updateSettings({ paymentMethods: updatedMethods });
    setNewPaymentMethod('');
  };

  const handleDeletePaymentMethod = (value: string) => {
    const updatedMethods = settings.paymentMethods.filter(method => method.value !== value);
    updateSettings({ paymentMethods: updatedMethods });
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
                name="splashLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Splash Screen Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/splash-logo.png" {...field} />
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
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-8" />
       <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage the payment methods available to customers at checkout.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {(settings.paymentMethods || []).map(method => (
              <div key={method.value} className="flex items-center justify-between p-3 rounded-md border bg-secondary">
                <span className="flex items-center gap-2"><Wallet className="w-4 h-4 text-muted-foreground"/> {method.label}</span>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeletePaymentMethod(method.value)}>
                    <Trash2 className="w-4 h-4"/>
                </Button>
              </div>
            ))}
             {(!settings.paymentMethods || settings.paymentMethods.length === 0) && <p className="text-muted-foreground text-sm p-4 text-center">No payment methods configured.</p>}
          </div>
          <Separator />
          <div className="flex gap-2 items-center pt-4">
            <Input 
                placeholder="e.g. Stripe" 
                value={newPaymentMethod}
                onChange={(e) => setNewPaymentMethod(e.target.value)}
            />
            <Button onClick={handleAddPaymentMethod}>
                <PlusCircle className="mr-2 h-4 w-4"/> Add Method
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />
      
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Send a test notification to all subscribed users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSendTestNotification}>
            <Bell className="mr-2 h-4 w-4" />
            Send Test Notification
          </Button>
           <p className="text-xs text-muted-foreground mt-4">
              Note: This is a developer feature. Proper notification sending requires server-side setup which is beyond the current scope. This button simulates the action and logs the intent.
           </p>
        </CardContent>
      </Card>

    </div>
  );
}
