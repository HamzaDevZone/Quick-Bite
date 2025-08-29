
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
    let path = '';
    try {
      path = window.location.pathname;
    } catch (e) {
      // window is not available in server-side rendering
    }
    

    if (path.startsWith('/admin')) {
      q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
    } else if (path.startsWith('/rider')) {
       try {
          const authData = sessionStorage.getItem('quickbite_rider_auth');
          const riderId = authData ? JSON.parse(authData).riderId : null;
          if (riderId) {
             q = query(collection(db, 'orders'), where('riderId', '==', riderId));
          } else {
             setOrders([]);
             setLoading(false);
             return;
          }
       } catch (error) {
          console.error("Could not load rider data from sessionStorage", error);
          setOrders([]);
          setLoading(false);
          return;
       }
    } else if (user) {
      q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    } else {
      try {
        const storedOrderIds = JSON.parse(localStorage.getItem('quickbite_user_orders') || '[]');
        setUserOrderIds(storedOrderIds);
        if (storedOrderIds.length > 0) {
          q = query(collection(db, 'orders'), where('__name__', 'in', storedOrderIds));
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
      const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      if (user && !path.startsWith('/admin') && !path.startsWith('/rider')) {
        setUserOrderIds(fetchedOrders.map(o => o.id));
      }

      fetchedOrders.sort((a, b) => {
        const dateA = typeof a.orderDate === 'string' ? new Date(a.orderDate) : a.orderDate.toDate();
        const dateB = typeof b.orderDate === 'string' ? new Date(b.orderDate) : b.orderDate.toDate();
        return dateB.getTime() - dateA.getTime();
      });
      setOrders(fetchedOrders);

      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders in real-time: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch orders.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, toast]);


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
