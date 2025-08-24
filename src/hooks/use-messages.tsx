'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp, query, where, orderBy, onSnapshot, Unsubscribe, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message, Conversation } from '@/lib/types';
import { useToast } from './use-toast';

interface MessageContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  loadingConversations: boolean;
  loadingMessages: Record<string, boolean>;
  addMessage: (data: { userName: string; userEmail: string; text: string }) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState<Record<string, boolean>>({});
  const [messageUnsubscribers, setMessageUnsubscribers] = useState<Record<string, Unsubscribe>>({});

  useEffect(() => {
    const q = query(collection(db, 'conversations'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
      setConversations(convos);
      setLoadingConversations(false);
    }, (error) => {
      console.error("Error fetching conversations: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch conversations.' });
      setLoadingConversations(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  useEffect(() => {
    return () => {
      Object.values(messageUnsubscribers).forEach(unsub => unsub());
    }
  }, [messageUnsubscribers]);

  const watchMessages = useCallback((conversationId: string) => {
    if (messageUnsubscribers[conversationId]) return;

    setLoadingMessages(prev => ({ ...prev, [conversationId]: true }));
    const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(prev => ({ ...prev, [conversationId]: msgs }));
      setLoadingMessages(prev => ({ ...prev, [conversationId]: false }));
      
      // Mark conversation as read
      const convoDocRef = doc(db, 'conversations', conversationId);
      updateDoc(convoDocRef, { isReadByAdmin: true }).catch(console.error);

    }, (error) => {
      console.error(`Error fetching messages for ${conversationId}: `, error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch messages.' });
      setLoadingMessages(prev => ({ ...prev, [conversationId]: false }));
    });
    
    setMessageUnsubscribers(prev => ({ ...prev, [conversationId]: unsubscribe }));

  }, [messageUnsubscribers, toast]);

  const addMessage = async ({ userName, userEmail, text }: { userName: string; userEmail: string; text: string }) => {
    const conversationId = userEmail;
    try {
      // Add message
      await addDoc(collection(db, 'messages'), {
        conversationId,
        sender: 'user',
        text,
        createdAt: Timestamp.now(),
      });
      
      // Update or create conversation
      const conversationDocRef = doc(db, 'conversations', conversationId);
      await setDoc(conversationDocRef, {
        userName,
        lastMessage: text,
        updatedAt: Timestamp.now(),
        isReadByAdmin: false,
      }, { merge: true });

    } catch (error) {
      console.error("Error sending message: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not send message.' });
    }
  };

  const sendMessage = async (conversationId: string, text: string) => {
    try {
        await addDoc(collection(db, 'messages'), {
            conversationId,
            sender: 'admin',
            text,
            createdAt: Timestamp.now(),
        });

        const conversationDocRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationDocRef, {
            lastMessage: text,
            updatedAt: Timestamp.now(),
        });
    } catch(error) {
        console.error("Error sending admin message: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not send reply.' });
    }
  }

  // Effect to watch messages for selected conversation
  useEffect(() => {
      const selectedConvo = conversations.find(c => messages[c.id]);
      if (selectedConvo && !messageUnsubscribers[selectedConvo.id]) {
          watchMessages(selectedConvo.id);
      }
  }, [conversations, messages, messageUnsubscribers, watchMessages]);

  const contextValue: MessageContextType = {
    conversations,
    messages,
    loadingConversations,
    loadingMessages,
    addMessage,
    sendMessage,
  };
  
  // Custom logic to automatically watch messages for any conversation that is selected
  const augmentedContext: MessageContextType = {
      ...contextValue,
      get messages() {
          const selectedConvoId = (Object.entries(loadingMessages).find(([id, loading]) => !loading && messages[id]) || [])[0];
          if(selectedConvoId && !messageUnsubscribers[selectedConvoId]) {
              watchMessages(selectedConvoId)
          }
          return contextValue.messages;
      }
  };


  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }

  // This effect ensures that when a conversation is selected (i.e., its messages are requested),
  // we start listening for real-time updates.
  Object.keys(context.messages).forEach(convoId => {
      // @ts-ignore - a bit of a hack to check if we are already subscribed
      if (!context.messageUnsubscribers?.[convoId]) {
          // @ts-ignore
          context.watchMessages?.(convoId);
      }
  })


  return context;
};
