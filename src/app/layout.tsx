
'use client';

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
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/hooks/use-theme';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <SiteSettingsProvider>
                  <ProductProvider>
                      <CategoryProvider>
                        <RiderProvider>
                            <OrderProvider>
                              <ReviewProvider>
                                  <CartProvider>
                                      {children}
                                      <Toaster />
                                  </CartProvider>
                              </ReviewProvider>
                            </OrderProvider>
                        </RiderProvider>
                      </CategoryProvider>
                  </ProductProvider>
                </SiteSettingsProvider>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
