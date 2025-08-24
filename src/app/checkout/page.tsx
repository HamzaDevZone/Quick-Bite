
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useOrders } from '@/hooks/use-orders';
import { UserHeader } from '@/components/user/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Landmark, Wallet } from 'lucide-react';

const paymentMethods = [
    { value: 'Cash on Delivery', label: 'Cash on Delivery', icon: Wallet },
    { value: 'Jazzcash', label: 'Jazzcash/Easypaisa', icon: CreditCard },
    { value: 'Bank Transfer', label: 'Bank Transfer', icon: Landmark },
    { value: 'Sadapay/Nayapay', label: 'Sadapay/Nayapay', icon: CreditCard },
    { value: 'Payoneer', label: 'Payoneer', icon: CreditCard },
];

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required.'),
  customerPhone: z.string().min(10, 'A valid phone number is required.'),
  customerAddress: z.string().min(10, 'A valid address is required.'),
  paymentMethod: z.string({ required_error: 'Please select a payment method.' }),
});

export default function CheckoutPage() {
  const { cart, cartTotal, itemCount, clearCart } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
    },
  });

  if (itemCount === 0) {
    if(typeof window !== 'undefined'){
        router.replace('/menu');
    }
    return null;
  }

  const onSubmit = async (values: z.infer<typeof checkoutSchema>) => {
    const deliveryFee = 5.00;
    const orderData = {
      ...values,
      items: cart,
      total: cartTotal + deliveryFee,
    };
    await addOrder(orderData);
    toast({
      title: 'Order Placed!',
      description: 'Thank you for your order. We have started processing it.',
    });
    clearCart();
    router.push('/orders');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 font-headline text-primary">Checkout</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-12 items-start">
            <div>
                <Card className="mb-8">
                <CardHeader>
                    <CardTitle>1. Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="555-123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="customerAddress"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Main St, Anytown, USA" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2. Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            {paymentMethods.map((method) => (
                                                <FormItem key={method.value} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 has-[[data-state=checked]]:bg-accent/80 transition-colors">
                                                    <FormControl>
                                                        <RadioGroupItem value={method.value} />
                                                    </FormControl>
                                                    <method.icon className="h-5 w-5 text-muted-foreground" />
                                                    <FormLabel className="font-normal flex-grow cursor-pointer">
                                                        {method.label}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

            </div>
            <div>
                <Card className="bg-secondary sticky top-24">
                <CardHeader>
                    <CardTitle>3. Your Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex items-center gap-4">
                        <Image src={item.product.imageUrl} alt={item.product.name} width={64} height={64} className="rounded-md" data-ai-hint="food item"/>
                        <div className="flex-grow">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>$5.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${(cartTotal + 5.00).toFixed(2)}</span>
                    </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Placing Order...' : 'Place Order'}
                    </Button>
                </CardFooter>
                </Card>
            </div>
            </form>
        </Form>
      </main>
    </div>
  );
}
