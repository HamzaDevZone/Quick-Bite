
'use client';

import { useState } from 'react';
import { useMessages } from '@/hooks/use-messages';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowLeft, User, Bike } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Conversation, Message } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function AdminMessagesPage() {
    const { conversations, messages, loadingConversations, loadingMessages, sendMessage } = useMessages();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [reply, setReply] = useState('');

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
    };

    const handleSendMessage = async () => {
        if (!reply.trim() || !selectedConversation) return;
        await sendMessage(selectedConversation.id, reply);
        setReply('');
    };

    if (loadingConversations) {
        return <Skeleton className="h-96 w-full" />
    }

    if (!selectedConversation) {
        return (
            <div>
                <h1 className="text-3xl font-bold font-headline mb-6">Messages</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {conversations.length === 0 ? (
                             <p className="text-muted-foreground">No messages yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {conversations.map(convo => (
                                    <div key={convo.id} onClick={() => handleSelectConversation(convo)}
                                        className={cn(
                                            "flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-accent",
                                            !convo.isReadByAdmin && "bg-primary/10"
                                        )}>
                                        <div className="flex items-center gap-3">
                                             <Avatar>
                                                <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className={cn("font-semibold", !convo.isReadByAdmin && "text-primary")}>{convo.userName}</p>
                                                <p className="text-sm text-muted-foreground truncate max-w-xs">{convo.lastMessage}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge variant="outline" className="capitalize">
                                                {convo.userType === 'rider' ? <Bike className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                                                {convo.userType}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">{format(convo.updatedAt.toDate(), 'PP')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const currentMessages = messages[selectedConversation.id] || [];

    return (
        <div>
             <Button variant="ghost" onClick={() => setSelectedConversation(null)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Conversations
            </Button>
            <Card className="flex flex-col h-[calc(100vh-12rem)]">
                <CardHeader>
                    <CardTitle>Conversation with {selectedConversation.userName}</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-grow p-4">
                    <div className="space-y-4">
                         {loadingMessages[selectedConversation.id] ? (
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-3/4" />
                                <Skeleton className="h-16 w-3/4 ml-auto" />
                            </div>
                        ) : (
                            currentMessages.map(msg => (
                                <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'admin' ? 'justify-end' : 'justify-start')}>
                                     {msg.sender !== 'admin' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{selectedConversation.userName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                     )}
                                     <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", msg.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                         <p>{msg.text}</p>
                                         <p className={cn("text-xs mt-1",  msg.sender === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{format(msg.createdAt.toDate(), 'p')}</p>
                                     </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
                <CardFooter className="p-4 border-t">
                   <div className="flex w-full gap-2">
                     <Textarea
                            placeholder="Type your reply..."
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="flex-grow"
                        />
                        <Button onClick={handleSendMessage} disabled={!reply.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                   </div>
                </CardFooter>
            </Card>
        </div>
    );
}

