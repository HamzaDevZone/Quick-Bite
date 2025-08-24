"use client"
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '@/lib/data';
import { ProductCard } from '@/components/user/ProductCard';
import { CategoryTabs } from '@/components/user/CategoryTabs';
import { UserHeader } from '@/components/user/Header';
import { SplashScreen } from '@/components/user/SplashScreen';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = PRODUCTS.filter(product => {
    const categoryMatch = activeCategory === 'all' || product.category.toLowerCase() === activeCategory;
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <>
      <SplashScreen />
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-1 container mx-auto py-8 px-4">
          <section className="text-center mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-2 font-headline">
              Welcome to QuickBite
            </h1>
            <p className="text-lg text-muted-foreground">
              Delicious food, delivered fast to your door.
            </p>
          </section>

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
          
          <CategoryTabs 
            categories={CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </main>
        <footer className="bg-secondary py-4 mt-12">
            <div className="container mx-auto text-center text-muted-foreground text-sm">
                &copy; 2024 QuickBite. All Rights Reserved.
            </div>
        </footer>
      </div>
    </>
  );
}
