'use client';

import { useCart } from '@/hooks/use-cart';
import { useOrders } from '@/hooks/use-orders';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { useToast } from '@/hooks/use-toast';
import type { ServiceType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useCategories } from './use-categories';

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
  const { categories } = useCategories();
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

    // Determine the service type from the first item in the cart
    const firstItemCategoryName = cart[0].product.category;
    const firstItemCategory = categories.find(c => c.name === firstItemCategoryName);
    const serviceType: ServiceType = firstItemCategory?.serviceType || 'Food'; // Default to 'Food' if not found

    const orderData = {
      ...values,
      items: cart,
      total: cartTotal + deliveryFee,
      deliveryFee: deliveryFee,
      serviceType: serviceType,
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
