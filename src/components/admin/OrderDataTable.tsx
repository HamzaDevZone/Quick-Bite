'use client';

import { useOrders } from '@/hooks/use-orders';
import type { Order, OrderStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderDataTableProps {
  data: Order[];
}

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  Preparing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  Delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
};

export function OrderDataTable({ data }: OrderDataTableProps) {
  const { updateOrderStatus } = useOrders();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(order => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
              <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Pending')}>
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Preparing')}>
                      Mark as Preparing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Delivered')}>
                      Mark as Delivered
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
