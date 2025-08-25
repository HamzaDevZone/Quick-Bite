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
import { sendTestNotification } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const appearanceFormSchema = z.object({
  heroImageUrl: z.string().url('Please enter a valid URL.'),
  splashImageUrl: z.string().url('Please enter a valid URL.'),
  splashLogoUrl: z.string().url('Please enter a valid URL.'),
  menuImageUrl: z.string().url('Please enter a valid URL.'),
  deliveryFee: z.coerce.number().min(0, 'Delivery fee cannot be negative.'),
});

export default function AdminAppearancePage() {
  const { settings, updateSettings } = useSiteSettings();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      heroImageUrl: settings.heroImageUrl,
      splashImageUrl: settings.splashImageUrl,
      splashLogoUrl: settings.splashLogoUrl,
      menuImageUrl: settings.menuImageUrl,
      deliveryFee: settings.deliveryFee,
    },
  });
  
  useEffect(() => {
    form.reset({ 
      heroImageUrl: settings.heroImageUrl,
      splashImageUrl: settings.splashImageUrl,
      splashLogoUrl: settings.splashLogoUrl,
      menuImageUrl: settings.menuImageUrl,
      deliveryFee: settings.deliveryFee,
    });
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
