
'use client';

import { UserHeader } from '@/components/user/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In the next step, we'll implement the logic to save this to Firestore.
        toast({
            title: "Message Sent!",
            description: "An admin will get back to you shortly.",
        });
        // Here you would clear the form, but we'll add that with the state logic.
    };

    return (
        <div className="min-h-screen flex flex-col">
            <UserHeader />
            <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-primary mb-4" />
                        <CardTitle className="text-3xl font-bold font-headline">Contact Us</CardTitle>
                        <CardDescription>Have a question or a problem? Let us know.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input id="name" placeholder="John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Your Message</Label>
                                <Textarea id="message" placeholder="Please describe your issue..." required rows={6} />
                            </div>
                            <Button type="submit" className="w-full">
                                <Send className="mr-2 h-4 w-4" /> Send Message
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
