
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

    const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allOrdersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        
        const path = window.location.pathname;

        if (path.startsWith('/admin')) {
             setOrders(allOrdersData);
        } else if (path.startsWith('/rider')) {
            try {
                const authData = sessionStorage.getItem('quickbite_rider_auth');
                if (authData) {
                    const riderId = JSON.parse(authData).riderId;
                    const riderOrders = allOrdersData.filter(o => o.riderId === riderId);
                    setOrders(riderOrders);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.error("Could not load rider data from sessionStorage", error);
                setOrders([]);
            }
        } else if (user) { // Logged-in customer
            const userOrders = allOrdersData.filter(o => o.userId === user.uid);
            setOrders(userOrders);
            setUserOrderIds(userOrders.map(o => o.id));
        } else { // Guest customer
             try {
                const storedOrderIds = localStorage.getItem('quickbite_user_orders');
                if (storedOrderIds) {
                    const ids = JSON.parse(storedOrderIds);
                    setUserOrderIds(ids);
                    const guestOrders = allOrdersData.filter(o => ids.includes(o.id));
                    setOrders(guestOrders);
                } else {
                    setOrders([]);
                }
              } catch (error) {
                  console.error("Could not load guest order IDs from localStorage", error);
                  setOrders([]);
              }
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
