'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Order, OrderStatus } from '@/lib/types';
import { ORDERS } from '@/lib/data';
import { useToast } from './use-toast';

interface OrderContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    toast({ title: 'Order Updated', description: `Order ${orderId} status has been updated to ${status}.` });
  };

  return (
    <OrderContext.Provider value={{ orders, updateOrderStatus }}>
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
