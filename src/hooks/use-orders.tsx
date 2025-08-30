
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp, query, where, onSnapshot, orderBy, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus, OrderItem } from '@/lib/types';
import { useToast } from './use-toast';
import { useAuth } from './use-auth';

interface NewOrderData {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    deliveryFee: number;
    orderNotes?: string;
    mainCategoryId: string;
}

interface OrderContextType {
  orders: Order[];
  userOrderIds: string[];
  addOrder: (orderData: NewOrderData) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  assignRiderToOrder: (orderId: string, riderId: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function generateShortOrderId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrderIds, setUserOrderIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const addOrder = useCallback(async (orderData: NewOrderData) => {
    try {
        const orderId = generateShortOrderId();
        const newOrderData: any = {
            ...orderData,
            id: orderId,
            status: 'Pending' as OrderStatus,
            orderDate: Timestamp.now(),
        };

        if (user) {
            newOrderData.userId = user.uid;
        }

        const docRef = doc(db, 'orders', orderId);
        await setDoc(docRef, newOrderData);
        
        if (!user) {
             try {
                const currentOrderIds = JSON.parse(localStorage.getItem('quickbite_user_orders') || '[]');
                const updatedOrderIds = [...currentOrderIds, orderId];
                setUserOrderIds(updatedOrderIds);
                localStorage.setItem('quickbite_user_orders', JSON.stringify(updatedOrderIds));
            } catch (error) {
                console.error("Could not save user order ID to localStorage", error);
            }
        }
       
    } catch (error) {
      console.error("Error adding order: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not place order.' });
    }
  }, [user, toast]);


  useEffect(() => {
    setLoading(true);
    let q;
    let path = '';
    try {
      path = window.location.pathname;
    } catch (e) {
      // window is not available in server-side rendering
    }
    
    // For admin and rider panels, we fetch all orders and filter client-side.
    if (path.startsWith('/admin') || path.startsWith('/rider')) {
      q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
    } else if (user) {
      // To prevent the composite index error, we will only query by userId
      // and perform the sorting on the client-side.
      q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    } else {
      try {
        const storedOrderIds = JSON.parse(localStorage.getItem('quickbite_user_orders') || '[]');
        setUserOrderIds(storedOrderIds);
        if (storedOrderIds.length > 0) {
          q = query(collection(db, 'orders'), where('id', 'in', storedOrderIds));
        } else {
          setOrders([]);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Could not load guest order IDs from localStorage", error);
        setOrders([]);
        setLoading(false);
        return;
      }
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedOrders = querySnapshot.docs.map(doc => ({ ...doc.data() } as Order));
      
      // Sort on the client side to avoid needing a composite index
      fetchedOrders.sort((a, b) => {
        const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toDate() : new Date(a.orderDate);
        const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toDate() : new Date(b.orderDate);
        return dateB.getTime() - dateA.getTime();
      });

      setOrders(fetchedOrders);
      if (user && !path.startsWith('/admin') && !path.startsWith('/rider')) {
        setUserOrderIds(fetchedOrders.map(o => o.id));
      }

      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders in real-time: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch orders.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderDoc = doc(db, 'orders', orderId);
      await updateDoc(orderDoc, { status });
      toast({ title: 'Order Updated', description: `Order status has been updated to ${status}.` });
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update order status.' });
    }
  };
  
  const assignRiderToOrder = async (orderId: string, riderId: string) => {
    try {
      const orderDoc = doc(db, 'orders', orderId);
      await updateDoc(orderDoc, { riderId, status: 'Preparing' });
      toast({ title: 'Rider Assigned', description: `Rider has been assigned to the order.`});
    } catch (error) {
       console.error("Error assigning rider: ", error);
       toast({ variant: 'destructive', title: 'Error', description: 'Could not assign rider.' });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
        await deleteDoc(doc(db, 'orders', orderId));
        
        if (!user) {
            try {
                const currentOrderIds = JSON.parse(localStorage.getItem('quickbite_user_orders') || '[]');
                const updatedOrderIds = currentOrderIds.filter((id: string) => id !== orderId);
                setUserOrderIds(updatedOrderIds);
                localStorage.setItem('quickbite_user_orders', JSON.stringify(updatedOrderIds));
            } catch (error) {
                console.error("Could not remove order ID from localStorage", error);
            }
        }
        
        toast({
            variant: 'destructive',
            title: 'Order Deleted',
            description: 'Your order has been permanently removed.',
        });
    } catch (error) {
        console.error("Error deleting order: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the order.' });
    }
  };

  return (
    <OrderContext.Provider value={{ orders, userOrderIds, addOrder, updateOrderStatus, assignRiderToOrder, deleteOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
