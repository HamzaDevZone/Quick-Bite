'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Order, OrderStatus, OrderItem } from '@/lib/types';
import { ORDERS } from '@/lib/data';
import { useToast } from './use-toast';

interface NewOrderData {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: NewOrderData) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignRiderToOrder: (orderId: string, riderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const addOrder = (orderData: NewOrderData) => {
    const newOrder: Order = {
        ...orderData,
        id: `ORD${(orders.length + 1).toString().padStart(3, '0')}`,
        status: 'Pending',
        orderDate: new Date().toISOString(),
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    toast({ title: 'Order Updated', description: `Order ${orderId} status has been updated to ${status}.` });
  };
  
  const assignRiderToOrder = (orderId: string, riderId: string) => {
    setOrders(prevOrders =>
        prevOrders.map(o => (o.id === orderId ? { ...o, riderId, status: 'Preparing' } : o))
    );
    toast({ title: 'Rider Assigned', description: `Rider has been assigned to order ${orderId}.`});
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, assignRiderToOrder }}>
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
