
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { collection, addDoc, updateDoc, doc, Timestamp, query, where, orderBy, onSnapshot, Unsubscribe, setDoc, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message, Conversation, UserType } from '@/lib/types';
import { useToast } from './use-toast';

interface MessageContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  loadingConversations: boolean;
  loadingMessages: Record<string, boolean>;
  addMessage: (data: { userName: string; userEmail: string; text: string, userType: UserType }) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  watchMessagesForConversation: (conversationId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState<Record<string, boolean>>({});
  const [activeUnsubscriber, setActiveUnsubscriber] = useState<Unsubscribe | null>(null);

  useEffect(() => {
    // Only admins see the full list of conversations
    const path = window.location.pathname;
    if (!path.startsWith('/admin')) {
      setLoadingConversations(false);
      return;
    }

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
    // Cleanup the active message listener on component unmount
    return () => {
      if (activeUnsubscriber) {
        activeUnsubscriber();
      }
    };
  }, [activeUnsubscriber]);

  const watchMessagesForConversation = useCallback((conversationId: string) => {
    // Unsubscribe from the previous listener if there is one
    if (activeUnsubscriber) {
      activeUnsubscriber();
    }

    setLoadingMessages(prev => ({ ...prev, [conversationId]: true }));
    const q = query(collection(db, 'messages'), where('conversationId', '==', conversationId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      
      msgs.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
      
      setMessages(prev => ({ ...prev, [conversationId]: msgs }));
      setLoadingMessages(prev => ({ ...prev, [conversationId]: false }));
      
      if (window.location.pathname.startsWith('/admin')) {
         const convoDocRef = doc(db, 'conversations', conversationId);
         updateDoc(convoDocRef, { isReadByAdmin: true }).catch(console.error);
      }

    }, (error) => {
      console.error(`Error fetching messages for ${conversationId}: `, error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch messages.' });
      setLoadingMessages(prev => ({ ...prev, [conversationId]: false }));
    });
    
    setActiveUnsubscriber(() => unsubscribe);

  }, [activeUnsubscriber, toast]);

  const addMessage = async ({ userName, userEmail, text, userType }: { userName: string; userEmail: string; text: string, userType: UserType }) => {
    const conversationId = userEmail; // Use email as the unique conversation ID
    try {
      await addDoc(collection(db, 'messages'), {
        conversationId,
        sender: userType,
        text,
        createdAt: Timestamp.now(),
      });
      
      const conversationDocRef = doc(db, 'conversations', conversationId);
      await setDoc(conversationDocRef, {
        userName,
        userType,
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

  const value = { conversations, messages, loadingConversations, loadingMessages, addMessage, sendMessage, watchMessagesForConversation };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (conversationId: string | null, userType: UserType) => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }

  const { watchMessagesForConversation, addMessage, sendMessage, loadingMessages, conversations, loadingConversations } = context;

  useEffect(() => {
    // If a user/rider is on the contact page, automatically watch their conversation
    if (conversationId && userType !== 'admin') {
      watchMessagesForConversation(conversationId);
    }
  }, [conversationId, userType, watchMessagesForConversation]);

  const messagesForConversation = useMemo(() => {
    if (!conversationId) return [];
    return context.messages[conversationId] || [];
  }, [context.messages, conversationId]);

  return {
    messages: messagesForConversation,
    addMessage,
    sendMessage,
    loadingMessages: conversationId ? loadingMessages[conversationId] || false : false,
    conversationId: conversationId,
    conversations,
    loadingConversations,
    watchMessagesForConversation
  };
};
