
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
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';

interface RiderOrderDataTableProps {
  data: Order[];
}

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  Preparing: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  Picked: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  Delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
};

export function RiderOrderDataTable({ data }: RiderOrderDataTableProps) {
  const { updateOrderStatus } = useOrders();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };
  
  if (data.length === 0) {
    return (
        <div className="rounded-md border bg-card flex items-center justify-center h-48">
            <p className="text-muted-foreground">No orders found.</p>
        </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <ScrollArea className="w-full whitespace-nowrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {data.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link href={`/rider/orders/${order.id}`} className="text-primary hover:underline">
                        #{order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.customerAddress}</TableCell>
                  <TableCell className="text-right">PKR {order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={order.status === 'Delivered' || order.status === 'Pending'}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(order.id, 'Picked')}
                          disabled={order.status !== 'Preparing'}
                        >
                          Mark as Picked
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(order.id, 'Delivered')}
                          disabled={order.status !== 'Picked'}
                        >
                          Mark as Delivered
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
