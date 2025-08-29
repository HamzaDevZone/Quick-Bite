
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
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
}

interface OrderContextType {
  orders: Order[];
  userOrderIds: string[];
  addOrder: (orderData: NewOrderData) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  assignRiderToOrder: (orderId: string, riderId: string) => Promise<void>;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrderIds, setUserOrderIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let q;
    const path = window.location.pathname;

    if (path.startsWith('/admin')) {
      // Admin gets all orders
      q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
    } else if (path.startsWith('/rider')) {
      // Rider-specific logic can also be optimized, but let's stick to the brief
      // This will be filtered client-side for now, but secured by rules.
      q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
    } else if (user) {
      // Logged-in user gets only their orders
      q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('orderDate', 'desc'));
    } else {
      // Guest user logic
      try {
        const storedOrderIds = JSON.parse(localStorage.getItem('quickbite_user_orders') || '[]');
        setUserOrderIds(storedOrderIds);
        if (storedOrderIds.length > 0) {
          // Fetch only the orders belonging to the guest
          q = query(collection(db, 'orders'), where('id', 'in', storedOrderIds));
        } else {
          setOrders([]);
          setLoading(false);
          return; // No need to query if there are no stored IDs
        }
      } catch (error) {
        console.error("Could not load guest order IDs from localStorage", error);
        setOrders([]);
        setLoading(false);
        return;
      }
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

      if (path.startsWith('/rider')) {
        try {
          const authData = sessionStorage.getItem('quickbite_rider_auth');
          const riderId = authData ? JSON.parse(authData).riderId : null;
          setOrders(riderId ? fetchedOrders.filter(o => o.riderId === riderId) : []);
        } catch (error) {
          console.error("Could not load rider data from sessionStorage", error);
          setOrders([]);
        }
      } else {
         if (user) {
            setUserOrderIds(fetchedOrders.map(o => o.id));
        }
        fetchedOrders.sort((a, b) => {
            const dateA = typeof a.orderDate === 'string' ? new Date(a.orderDate) : a.orderDate.toDate();
            const dateB = typeof b.orderDate === 'string' ? new Date(b.orderDate) : b.orderDate.toDate();
            return dateB.getTime() - dateA.getTime();
        });
        setOrders(fetchedOrders);
      }

      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders in real-time: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch orders.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);


  const addOrder = async (orderData: NewOrderData) => {
    try {
        const newOrderData: any = {
            ...orderData,
            status: 'Pending' as OrderStatus,
            orderDate: Timestamp.now(),
        };

        if (user) {
            newOrderData.userId = user.uid;
        }

        const docRef = await addDoc(collection(db, 'orders'), newOrderData);
        
        // Add the auto-generated id to the document after creation
        await updateDoc(docRef, { id: docRef.id });

        const newOrder = { ...newOrderData, id: docRef.id } as Order;
        
        if (!user) {
             try {
                const currentOrderIds = JSON.parse(localStorage.getItem('quickbite_user_orders') || '[]');
                const updatedOrderIds = [...currentOrderIds, newOrder.id];
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
  };

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
  }

  return (
    <OrderContext.Provider value={{ orders, userOrderIds, addOrder, updateOrderStatus, assignRiderToOrder, loading }}>
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
