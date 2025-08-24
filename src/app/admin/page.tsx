
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useOrders } from '@/hooks/use-orders';
import { useProducts } from '@/hooks/use-products';
import { DollarSign, Package, ShoppingCart, Activity } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import type { Timestamp } from 'firebase/firestore';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function AdminDashboardPage() {
    const { orders } = useOrders();
    const { products } = useProducts();

    const deliveredOrders = orders.filter(order => order.status === 'Delivered');

    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const activeOrders = orders.filter(order => order.status !== 'Delivered').length;
    const totalProducts = products.length;

    // Prepare data for the last 7 days
    const salesData: { date: string; revenue: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        salesData.push({ date: dateString, revenue: 0 });
    }

    deliveredOrders.forEach(order => {
        const orderDateObj = order.orderDate instanceof Timestamp ? order.orderDate.toDate() : new Date(order.orderDate);
        
        const todayMinus7 = new Date(today);
        todayMinus7.setDate(today.getDate() - 6);

        if (orderDateObj >= todayMinus7 && orderDateObj <= today) {
            const dateString = orderDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const index = salesData.findIndex(d => d.date === dateString);
            if (index !== -1) {
                salesData[index].revenue += order.total;
            }
        }
    });
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            From all completed orders
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Orders
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Total orders placed
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{activeOrders}</div>
                        <p className="text-xs text-muted-foreground">
                           Orders needing processing
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            Available items for sale
                        </p>
                    </CardContent>
                </Card>
            </div>
             <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>Revenue from the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
