
'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserHeader } from '@/components/user/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send } from 'lucide-react';
import { useMessages } from '@/hooks/use-messages';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message as MessageType } from '@/lib/types';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

export default function ContactPage() {
    const { toast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const { messages, loadingMessages, addMessage, sendMessage, conversationId } = useMessages(user?.email || null, 'user');
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
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to send a message.' });
            return;
        }

        setIsSending(true);
        await addMessage({
            userName: user.displayName || 'Unknown User',
            userEmail: user.email!,
            text: values.message,
            userType: 'user'
        });
        setIsSending(false);
        form.reset();
    };

    const isLoading = authLoading || (conversationId && loadingMessages[conversationId]);

    return (
        <div className="min-h-screen flex flex-col">
            <UserHeader />
            <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                <Card className="w-full max-w-2xl h-[70vh] flex flex-col">
                    <CardHeader className="text-center">
                        <MessageSquare className="mx-auto h-10 w-10 text-primary mb-2" />
                        <CardTitle className="text-3xl font-bold font-headline">Contact Support</CardTitle>
                        <CardDescription>We're here to help. Send us a message!</CardDescription>
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
                                    <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                                         {msg.sender === 'admin' && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>A</AvatarFallback>
                                            </Avatar>
                                         )}
                                         <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                             <p>{msg.text}</p>
                                             <p className={cn("text-xs mt-1",  msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{format(msg.createdAt.toDate(), 'p')}</p>
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
                                            <Textarea placeholder="Type your message..." {...field} rows={1} className="min-h-0 resize-none" disabled={!user || isSending}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button type="submit" disabled={!user || isSending}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </Form>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
