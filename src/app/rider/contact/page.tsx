
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send } from 'lucide-react';
import { useMessages } from '@/hooks/use-messages';
import { useEffect, useState } from 'react';
import { useRiders } from '@/hooks/use-riders';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('A valid email is required.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export default function RiderContactPage() {
    const { toast } = useToast();
    const { addMessage } = useMessages();
    const { riders, loading: ridersLoading } = useRiders();
    const [riderId, setRiderId] = useState<string|null>(null);

    useEffect(() => {
        const authData = sessionStorage.getItem('quickbite_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
    }, []);
    
    const currentRider = riders.find(r => r.id === riderId);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    useEffect(() => {
        if(currentRider) {
            form.setValue('name', currentRider.name);
            form.setValue('email', currentRider.email);
        }
    }, [currentRider, form]);


    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        await addMessage({
            userName: values.name,
            userEmail: values.email,
            text: values.message,
            userType: 'rider'
        });

        toast({
            title: "Message Sent!",
            description: "An admin will get back to you shortly.",
        });
        
        form.reset({
            ...values,
            message: ''
        });
    };

    return (
        <div>
             <h1 className="text-3xl font-bold font-headline mb-6">Contact Admin</h1>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-3xl font-bold font-headline">Get In Touch</CardTitle>
                    <CardDescription>Have an issue with an order or a question? Let us know.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} readOnly disabled />
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
                                    <FormLabel>Your Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john@example.com" {...field} readOnly disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Message</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Please describe your issue..." {...field} rows={6} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                <Send className="mr-2 h-4 w-4" /> {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

