'use client';

import { useOrders } from '@/hooks/use-orders';
import type { Order, OrderStatus, Rider } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRiders } from '@/hooks/use-riders';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';

interface OrderDataTableProps {
  data: Order[];
}

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  Preparing: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  Picked: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  Delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
};

export function OrderDataTable({ data }: OrderDataTableProps) {
  const { updateOrderStatus, assignRiderToOrder } = useOrders();
  const { riders } = useRiders();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };
  
  const getRiderName = (riderId?: string) => {
    if (!riderId) return 'Unassigned';
    return riders.find(r => r.id === riderId)?.name || 'Unknown Rider';
  }

  return (
    <div className="rounded-md border bg-card">
      <ScrollArea className="w-full whitespace-nowrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Rider</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{getRiderName(order.riderId)}</TableCell>
                <TableCell className="text-right">PKR {order.total.toFixed(2)}</TableCell>
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
                      <DropdownMenuSub>
                          <DropdownMenuSubTrigger>Assign Rider</DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                  {riders.map(rider => (
                                      <DropdownMenuItem key={rider.id} onClick={() => assignRiderToOrder(order.id, rider.id)}>
                                          {rider.name}
                                      </DropdownMenuItem>
                                  ))}
                                   <DropdownMenuItem disabled={riders.length === 0}>
                                      {riders.length === 0 && 'No riders available'}
                                  </DropdownMenuItem>
                              </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Pending')} disabled={order.status === 'Pending'}>
                        Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Preparing')} disabled={order.status === 'Preparing'}>
                        Mark as Preparing
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Picked')} disabled={order.status === 'Picked'}>
                        Mark as Picked
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Delivered')} disabled={order.status === 'Delivered'}>
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
