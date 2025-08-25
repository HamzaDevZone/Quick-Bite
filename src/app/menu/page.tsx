
"use client"
import { useState, useRef } from 'react';
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { settings, isLoading: settingsLoading } = useSiteSettings();

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const carouselImages = [
      { src: settings.menuCarouselImage1, alt: 'Delicious pizza deal', hint: 'pizza deal' },
      { src: settings.menuCarouselImage2, alt: 'Fresh burgers and fries', hint: 'burgers fries' },
      { src: settings.menuCarouselImage3, alt: 'Family combo offer', hint: 'family meal' },
      { src: settings.menuCarouselImage4, alt: 'Spicy chicken wings', hint: 'chicken wings' },
  ]

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
          <section className="relative text-center mb-12 py-20 flex flex-col items-center justify-center text-white bg-secondary">
             <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{ loop: true }}
                >
                <CarouselContent>
                    {(isLoading ? Array(4).fill(0) : carouselImages).map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="relative h-[40vh] md:h-[50vh] w-full">
                           {isLoading ? <Skeleton className="w-full h-full" /> : (
                             <Image
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  className="object-cover"
                                  data-ai-hint={image.hint}
                              />
                           )}
                            <div className="absolute inset-0 bg-black/60"></div>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
            </Carousel>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 pointer-events-none">
                <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2 font-headline drop-shadow-lg">
                Our Menu
                </h1>
                <p className="text-lg text-white/90 drop-shadow-md">
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
            <p>&copy; 2024 QuickBite. All Rights Reserved.</p>
            <p className="text-xs mt-1">
              Developed by Huzaifa. To get your own website, feel free to reach out.
            </p>
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
