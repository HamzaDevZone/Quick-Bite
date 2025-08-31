
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { UserHeader } from '@/components/user/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Landmark, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Textarea } from '@/components/ui/textarea';
import type { PaymentMethod } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCheckout } from '@/hooks/use-checkout';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required.'),
  customerPhone: z.string().min(10, 'A valid phone number is required.'),
  customerAddress: z.string().min(10, 'A valid address is required.'),
  paymentMethod: z.string({ required_error: 'Please select a payment method.' }),
  orderNotes: z.string().optional(),
  transactionId: z.string().optional(),
  paymentScreenshotUrl: z.string().optional(),
}).refine(data => {
    const isCashOnDelivery = data.paymentMethod?.toLowerCase().includes('cash on delivery');
    if (!isCashOnDelivery) {
        return !!data.transactionId && !!data.paymentScreenshotUrl;
    }
    return true;
}, {
    message: "Transaction ID and Screenshot URL are required for this payment method.",
    path: ['transactionId'], // You can also set path to ['paymentScreenshotUrl']
}).refine(data => {
    const isCashOnDelivery = data.paymentMethod?.toLowerCase().includes('cash on delivery');
    if (!isCashOnDelivery && data.paymentScreenshotUrl) {
        try {
            new URL(data.paymentScreenshotUrl);
            return true;
        } catch (_) {
            return false;
        }
    }
    return true;
}, {
    message: "Please enter a valid URL for the screenshot.",
    path: ['paymentScreenshotUrl'],
});


export default function CheckoutPage() {
  const { cart, cartTotal, itemCount } = useCart();
  const { handleCheckout } = useCheckout();
  const { settings } = useSiteSettings();
  const deliveryFee = settings.deliveryFee;
  const router = useRouter();
  const [selectedMethodDetails, setSelectedMethodDetails] = useState<string | undefined>(undefined);
  const [isPaidMethodSelected, setIsPaidMethodSelected] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      orderNotes: '',
      transactionId: '',
      paymentScreenshotUrl: '',
    },
  });

  useEffect(() => {
    if (itemCount === 0) {
      router.replace('/menu');
    }
  }, [itemCount, router]);

  if (itemCount === 0) {
    return null; // Render nothing while redirecting
  }

  const onSubmit = async (values: z.infer<typeof checkoutSchema>) => {
    await handleCheckout(values);
  };

  const getIconForMethod = (methodValue: string) => {
    const lowerCaseValue = methodValue.toLowerCase();
    if (lowerCaseValue.includes('bank')) return Landmark;
    if (lowerCaseValue.includes('cash on delivery')) return Wallet;
    return CreditCard; // Default icon
  }

  const handlePaymentMethodChange = (value: string) => {
    form.setValue('paymentMethod', value);
    const selectedMethod = settings.paymentMethods.find(m => m.label === value);
    setSelectedMethodDetails(selectedMethod?.details);
    const isPaid = value.toLowerCase().includes('cash on delivery') === false;
    setIsPaidMethodSelected(isPaid);
    // Trigger validation when payment method changes
    if(form.formState.isSubmitted){
       form.trigger(['transactionId', 'paymentScreenshotUrl']);
    }
  }


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
                                <Input placeholder="0300-1234567" {...field} />
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
                                <Input placeholder="House 123, Street 4, Islamabad" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>2. Order Notes (Optional)</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <FormField
                            control={form.control}
                            name="orderNotes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Special Instructions</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g. Extra spicy, no onions, large size..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>3. Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={handlePaymentMethodChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            {(settings.paymentMethods || []).map((method) => {
                                                const Icon = getIconForMethod(method.label);
                                                return (
                                                    <FormItem key={method.id} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 has-[[data-state=checked]]:bg-accent/80 transition-colors">
                                                        <FormControl>
                                                            <RadioGroupItem value={method.label} />
                                                        </FormControl>
                                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                                        <FormLabel className="font-normal flex-grow cursor-pointer">
                                                            {method.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {selectedMethodDetails && (
                             <Alert className="mt-4">
                                <Wallet className="h-4 w-4" />
                                <AlertDescription>
                                    {selectedMethodDetails}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className={cn("pt-4 space-y-6 transition-all duration-300", isPaidMethodSelected ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden pointer-events-none")}>
                            <Alert variant="default" className="border-primary/50">
                                <AlertTitle className="font-bold">Payment Verification</AlertTitle>
                                <AlertDescription>
                                    For paid orders, please provide the transaction details below to help us verify your payment quickly.
                                </AlertDescription>
                            </Alert>
                             <FormField
                                control={form.control}
                                name="transactionId"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Transaction ID (Trx ID)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 8431873138" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paymentScreenshotUrl"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Payment Screenshot URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://imgbb.com/your-image-link" {...field} />
                                    </FormControl>
                                     <FormMessage />
                                    </FormItem>
                                )}
                            />
                           
                        </div>
                    </CardContent>
                </Card>

            </div>
            <div>
                <Card className="bg-secondary sticky top-24">
                <CardHeader>
                    <CardTitle>4. Your Order</CardTitle>
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
                        <p className="font-semibold">PKR {(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>PKR {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>PKR {deliveryFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>PKR {(cartTotal + deliveryFee).toFixed(2)}</span>
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
