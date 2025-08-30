
'use client';

import { useCart } from '@/hooks/use-cart';
import { useOrders } from '@/hooks/use-orders';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface CheckoutValues {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  orderNotes?: string;
}

export function useCheckout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { settings } = useSiteSettings();
  const deliveryFee = settings.deliveryFee;
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = async (values: CheckoutValues) => {
    if (cart.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Empty Cart',
        description: 'Your cart is empty. Please add items before checking out.',
      });
      return;
    }

    // Determine the main category from the first item in the cart
    const mainCategoryId = cart[0].product.mainCategoryId;
    if (!mainCategoryId) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not determine order category. Please try again.',
      });
      return;
    }

    const orderData = {
      ...values,
      items: cart,
      total: cartTotal + deliveryFee,
      deliveryFee: deliveryFee,
      mainCategoryId: mainCategoryId,
    };
    
    await addOrder(orderData);

    toast({
      title: 'Order Placed!',
      description: 'Thank you for your order. We have started processing it.',
    });
    
    clearCart();
    router.push('/orders');
  };

  return { handleCheckout };
}
