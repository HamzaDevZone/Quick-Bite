
"use client"
import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search, Utensils } from 'lucide-react';
import { ProductCard } from '@/components/user/ProductCard';
import { CategoryTabs } from '@/components/user/CategoryTabs';
import { UserHeader } from '@/components/user/Header';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteSettings } from '@/hooks/use-site-settings';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { settings, isLoading: settingsLoading } = useSiteSettings();


  const filteredProducts = products.filter(product => {
    const categoryMatch = activeCategory === 'all' || product.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const isLoading = productsLoading || categoriesLoading || settingsLoading;

  return (
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-1">
          <section className="relative text-center mb-12 py-20 flex flex-col items-center justify-center text-white">
            {isLoading ? <Skeleton className="absolute inset-0 w-full h-full" /> : (
              <Image
                src={settings.menuImageUrl}
                alt="Menu background"
                fill
                className="object-cover -z-10"
                data-ai-hint="delicious food background"
              />
            )}
            <div className="absolute inset-0 bg-black/60 -z-10"></div>
             <div className="z-10 p-4">
                <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2 font-headline">
                Our Menu
                </h1>
                <p className="text-lg text-white/90">
                Delicious food, ready to be delivered fast to your door.
                </p>
            </div>
          </section>

          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search for pizza, burgers, and more..."
                    className="pl-10 w-full h-12 text-base rounded-full bg-secondary border-transparent focus:border-primary focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>
            
            {isLoading ? (
                <div className="flex justify-center space-x-4 p-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-24 w-24 rounded-full" />
                </div>
            ) : (
                <CategoryTabs 
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                />
            )}

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
                {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                <div className="col-span-full text-center py-16">
                    <Utensils className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">No Products Found</h2>
                    <p className="mt-2 text-muted-foreground">Try adjusting your search or category selection.</p>
                </div>
                )}
            </section>
          </div>
        </main>
        <footer className="bg-secondary py-4 mt-12">
            <div className="container mx-auto text-center text-muted-foreground text-sm">
                &copy; 2024 QuickBite. All Rights Reserved.
            </div>
        </footer>
      </div>
  );
}

const CardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[192px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
     <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-6 w-1/4" />
       <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </div>
);

