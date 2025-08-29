
'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send } from 'lucide-react';
import { useMessages } from '@/hooks/use-messages';
import { useRiders } from '@/hooks/use-riders';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message as MessageType } from '@/lib/types';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

export default function RiderContactPage() {
    const { toast } = useToast();
    const { riders, loading: ridersLoading } = useRiders();
    const [riderId, setRiderId] = useState<string|null>(null);

    useEffect(() => {
        const authData = sessionStorage.getItem('quickbite_rider_auth');
        if (authData) {
            setRiderId(JSON.parse(authData).riderId);
        }
    }, []);
    
    const currentRider = riders.find(r => r.id === riderId);
    const { messages, loadingMessages, addMessage, conversationId } = useMessages(currentRider?.email || null, 'rider');
    const [isSending, setIsSending] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { message: '' },
    });

    useEffect(() => {
        if(scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!currentRider) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not find rider details.' });
            return;
        }

        setIsSending(true);
        await addMessage({
            userName: currentRider.name,
            userEmail: currentRider.email,
            text: values.message,
            userType: 'rider'
        });
        setIsSending(false);
        form.reset();
    };

    const isLoading = ridersLoading || (conversationId && loadingMessages[conversationId]);

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Contact Admin</h1>
            <Card className="w-full max-w-2xl mx-auto h-[70vh] flex flex-col">
                <CardHeader className="text-center">
                    <MessageSquare className="mx-auto h-10 w-10 text-primary mb-2" />
                    <CardTitle className="text-3xl font-bold font-headline">Support Chat</CardTitle>
                    <CardDescription>Have an issue with an order or a question? Let us know.</CardDescription>
                </CardHeader>
                <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-3/4" />
                                <Skeleton className="h-16 w-3/4 ml-auto" />
                            </div>
                        ) : messages.length > 0 ? (
                            messages.map((msg: MessageType) => (
                                <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'rider' ? 'justify-end' : 'justify-start')}>
                                     {msg.sender === 'admin' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>A</AvatarFallback>
                                        </Avatar>
                                     )}
                                     <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", msg.sender === 'rider' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                         <p>{msg.text}</p>
                                         <p className={cn("text-xs mt-1",  msg.sender === 'rider' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{format(msg.createdAt.toDate(), 'p')}</p>
                                     </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
                        )}
                    </div>
                </ScrollArea>
                <CardFooter className="p-4 border-t">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex gap-2 items-center">
                             <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <Textarea placeholder="Type your message..." {...field} rows={1} className="min-h-0 resize-none" disabled={!currentRider || isSending}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <Button type="submit" disabled={!currentRider || isSending}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}
