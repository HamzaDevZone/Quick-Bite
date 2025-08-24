import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/hooks/use-cart';
import { OrderProvider } from '@/hooks/use-orders';
import { ProductProvider } from '@/hooks/use-products';
import { SiteSettingsProvider } from '@/hooks/use-site-settings';
import { CategoryProvider } from '@/hooks/use-categories';
import { RiderProvider } from '@/hooks/use-riders';
import { ReviewProvider } from '@/hooks/use-reviews';
import { MessageProvider } from '@/hooks/use-messages';

export const metadata: Metadata = {
  title: 'QuickBite',
  description: 'A modern food ordering app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SiteSettingsProvider>
          <ProductProvider>
            <CategoryProvider>
              <RiderProvider>
                <OrderProvider>
                  <ReviewProvider>
                    <MessageProvider>
                      <CartProvider>
                        {children}
                        <Toaster />
                      </CartProvider>
                    </MessageProvider>
                  </ReviewProvider>
                </OrderProvider>
              </RiderProvider>
            </CategoryProvider>
          </ProductProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
