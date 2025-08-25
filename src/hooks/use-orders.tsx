
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

  useEffect(() => {
    const fetchOrders = async () => {
      // For admin/rider panels (and logged out users), fetch all orders
      if (!user) {
          try {
              const ordersCollection = collection(db, 'orders');
              const querySnapshot = await getDocs(ordersCollection);
              const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
              ordersData.sort((a, b) => {
                  const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toMillis() : new Date(a.orderDate).getTime();
                  const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toMillis() : new Date(b.orderDate).getTime();
                  return dateB - dateA;
              });

              // If user is not logged in, check local storage for their guest orders
              try {
                const storedOrderIds = localStorage.getItem('quickbite_user_orders');
                if (storedOrderIds) {
                    const ids = JSON.parse(storedOrderIds);
                    setUserOrderIds(ids);
                    const userPlacedOrders = ordersData.filter(o => ids.includes(o.id));
                    setOrders(userPlacedOrders);
                } else {
                    setOrders([]); // No guest orders found
                }
              } catch (error) {
                  console.error("Could not load user order IDs from localStorage", error);
                  setOrders([]);
              }
          } catch (error) {
              console.error("Error fetching all orders: ", error);
          } finally {
              setLoading(false);
          }
          return;
      }

      // For logged-in users, fetch only their orders
      try {
        setLoading(true);
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
    
    fetchOrders();
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
                setOrders(prevOrders => [newOrder, ...prevOrders]);
            } catch (error) {
                console.error("Could not save user order ID to localStorage", error);
            }
        } else {
           setOrders(prevOrders => [newOrder, ...prevOrders]);
           setUserOrderIds(prevIds => [...prevIds, newOrder.id]);
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
      
      const ordersCollection = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersCollection);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      ordersData.sort((a, b) => {
          const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toMillis() : new Date(a.orderDate).getTime();
          const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toMillis() : new Date(b.orderDate).getTime();
          return dateB - dateA;
      });

      if(!user) {
        const storedOrderIds = JSON.parse(localStorage.getItem('quickbite_user_orders') || '[]');
        const userPlacedOrders = ordersData.filter(o => storedOrderIds.includes(o.id));
        setOrders(userPlacedOrders);
      } else {
        const userOrders = ordersData.filter(o => o.userId === user.uid);
        setOrders(userOrders);
      }
      
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

      // Re-fetch all orders to reflect this change everywhere
      const ordersCollection = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersCollection);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      ordersData.sort((a, b) => {
          const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toMillis() : new Date(a.orderDate).getTime();
          const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toMillis() : new Date(b.orderDate).getTime();
          return dateB - dateA;
      });
      // This is a hack to get around a state update issue for now.
      // In a real app, this should be handled more gracefully with onSnapshot.
      window.location.reload();


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
