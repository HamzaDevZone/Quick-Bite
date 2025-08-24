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
});

export default function AdminAppearancePage() {
  const { settings, updateSettings } = useSiteSettings();

  const form = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      heroImageUrl: settings.heroImageUrl,
    },
  });
  
  useEffect(() => {
    form.reset({ heroImageUrl: settings.heroImageUrl });
  }, [settings, form]);

  function onSubmit(values: z.infer<typeof appearanceFormSchema>) {
    updateSettings(values);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Appearance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Settings</CardTitle>
          <CardDescription>Customize the look of your landing page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="heroImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-image.png" {...field} />
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
