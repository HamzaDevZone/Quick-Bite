'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, OrderStatus, OrderItem } from '@/lib/types';
import { useToast } from './use-toast';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrderIds, setUserOrderIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const ordersCollection = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersCollection);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      // Sort by date, newest first
      ordersData.sort((a, b) => {
        const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toMillis() : new Date(a.orderDate).getTime();
        const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toMillis() : new Date(b.orderDate).getTime();
        return dateB - dateA;
      });
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch orders.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    try {
      const storedOrderIds = localStorage.getItem('quickbite_user_orders');
      if (storedOrderIds) {
        setUserOrderIds(JSON.parse(storedOrderIds));
      }
    } catch (error) {
      console.error("Could not load user order IDs from localStorage", error);
    }
  }, []);

  const addOrder = async (orderData: NewOrderData) => {
    try {
        const newOrderData = {
            ...orderData,
            status: 'Pending' as OrderStatus,
            orderDate: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, 'orders'), newOrderData);
        
        const newOrder = { ...newOrderData, id: docRef.id } as Order;
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        
        try {
            const updatedOrderIds = [...userOrderIds, newOrder.id];
            setUserOrderIds(updatedOrderIds);
            localStorage.setItem('quickbite_user_orders', JSON.stringify(updatedOrderIds));
        } catch (error) {
            console.error("Could not save user order ID to localStorage", error);
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
