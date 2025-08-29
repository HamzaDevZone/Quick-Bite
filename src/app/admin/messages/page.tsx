
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useMessages } from '@/hooks/use-messages';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bike } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Conversation, Message as MessageType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function AdminMessagesPage() {
    const { conversations, messages, loadingConversations, loadingMessages, sendMessage, watchMessagesForConversation } = useMessages(null, 'admin');
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [reply, setReply] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if(scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
        }
    }, [messages, selectedConversation]);

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        watchMessagesForConversation(conversation.id);
    };

    const handleSendMessage = async () => {
        if (!reply.trim() || !selectedConversation) return;
        await sendMessage(selectedConversation.id, reply);
        setReply('');
    };

    const currentMessages = useMemo(() => {
        if (!selectedConversation) return [];
        return messages[selectedConversation.id] || [];
    }, [selectedConversation, messages]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
            {/* Conversations List */}
            <div className="md:col-span-1 h-full">
                 <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Conversations</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-grow">
                        <CardContent>
                            {loadingConversations ? (
                                <Skeleton className="h-48 w-full" />
                            ) : conversations.length === 0 ? (
                                 <p className="text-muted-foreground p-4 text-center">No messages yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {conversations.map(convo => (
                                        <div key={convo.id} onClick={() => handleSelectConversation(convo)}
                                            className={cn(
                                                "flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-accent",
                                                selectedConversation?.id === convo.id && 'bg-accent',
                                                !convo.isReadByAdmin && "bg-primary/10"
                                            )}>
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                 <Avatar>
                                                    <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="overflow-hidden">
                                                    <p className={cn("font-semibold truncate", !convo.isReadByAdmin && "text-primary")}>{convo.userName}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                <Badge variant="outline" className="capitalize text-xs">
                                                    {convo.userType === 'rider' ? <Bike className="mr-1.5 h-3 w-3" /> : <User className="mr-1.5 h-3 w-3" />}
                                                    {convo.userType}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground">{format(convo.updatedAt.toDate(), 'PP')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </ScrollArea>
                </Card>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 h-full">
                 <Card className="flex flex-col h-full">
                    {!selectedConversation ? (
                         <div className="flex-grow flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                                <p>Select a conversation to start chatting.</p>
                            </div>
                         </div>
                    ) : (
                        <>
                            <CardHeader className="border-b">
                                <CardTitle>Chat with {selectedConversation.userName}</CardTitle>
                            </CardHeader>
                            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                                <div className="space-y-4">
                                     {loadingMessages[selectedConversation.id] ? (
                                        <div className="space-y-4">
                                            <Skeleton className="h-16 w-3/4" />
                                            <Skeleton className="h-16 w-3/4 ml-auto" />
                                        </div>
                                    ) : (
                                        currentMessages.map((msg: MessageType) => (
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
                                        className="flex-grow resize-none"
                                        rows={1}
                                    />
                                    <Button onClick={handleSendMessage} disabled={!reply.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                               </div>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
