
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp, query, where } from 'firebase/firestore';
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

  const fetchOrders = async () => {
    if (!user) {
        // For admin/rider panels, fetch all orders
        try {
            const ordersCollection = collection(db, 'orders');
            const querySnapshot = await getDocs(ordersCollection);
            const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            ordersData.sort((a, b) => {
                const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toMillis() : new Date(a.orderDate).getTime();
                const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toMillis() : new Date(b.orderDate).getTime();
                return dateB - dateA;
            });
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching all orders: ", error);
        } finally {
            setLoading(false);
        }
        return;
    }

    // For logged-in users, fetch only their orders
    try {
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      ordersData.sort((a, b) => {
        const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toMillis() : new Date(a.orderDate).getTime();
        const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toMillis() : new Date(b.orderDate).getTime();
        return dateB - dateA;
      });
      setOrders(ordersData);
      setUserOrderIds(ordersData.map(o => o.id));

    } catch (error) {
      console.error("Error fetching user orders: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your orders.' });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // This will refetch orders when user logs in or out
    fetchOrders();
  }, [user]); // Dependency on user object
  
  useEffect(() => {
     // This part is for non-logged-in users who place orders
     if (!user) {
        try {
            const storedOrderIds = localStorage.getItem('quickbite_user_orders');
            if (storedOrderIds) {
                const ids = JSON.parse(storedOrderIds);
                setUserOrderIds(ids);
                // We still need to fetch the full order details for these IDs
                if (ids.length > 0 && orders.length > 0) {
                     const userPlacedOrders = orders.filter(o => ids.includes(o.id));
                     setOrders(userPlacedOrders);
                }
            }
        } catch (error) {
            console.error("Could not load user order IDs from localStorage", error);
        }
     }
  }, [user, orders]);


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
        
        const newOrder = { ...newOrderData, id: docRef.id } as Order;
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        
        if (!user) {
             try {
                const updatedOrderIds = [...userOrderIds, newOrder.id];
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
      setOrders(prevOrders =>
        prevOrders.map(o => (o.id === orderId ? { ...o, status } : o))
      );
      toast({ title: 'Order Updated', description: `Order ${orderId} status has been updated to ${status}.` });
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update order status.' });
    }
  };
  
  const assignRiderToOrder = async (orderId: string, riderId: string) => {
    try {
      const orderDoc = doc(db, 'orders', orderId);
      await updateDoc(orderDoc, { riderId, status: 'Preparing' });
      setOrders(prevOrders =>
          prevOrders.map(o => (o.id === orderId ? { ...o, riderId, status: 'Preparing' as OrderStatus } : o))
      );
      toast({ title: 'Rider Assigned', description: `Rider has been assigned to order ${orderId}.`});
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
