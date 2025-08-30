

"use client"
import { useState, useRef, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search, Utensils, ShoppingBasket } from 'lucide-react';
import { ProductCard } from '@/components/user/ProductCard';
import { CategoryTabs } from '@/components/user/CategoryTabs';
import { UserHeader } from '@/components/user/Header';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useReviews } from '@/hooks/use-reviews';
import type { Review, Product, ServiceType } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { ProductDetailDialog } from '@/components/user/ProductDetailDialog';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeServiceType, setActiveServiceType] = useState<ServiceType>('Food');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { settings, isLoading: settingsLoading } = useSiteSettings();
  const { reviews: allReviews, loading: reviewsLoading } = useReviews(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const productsPerPage = 8;

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const carouselImages = [
      { src: settings.menuCarouselImage1, alt: 'Delicious pizza deal', hint: 'pizza deal' },
      { src: settings.menuCarouselImage2, alt: 'Fresh burgers and fries', hint: 'burgers fries' },
      { src: settings.menuCarouselImage3, alt: 'Family combo offer', hint: 'family meal' },
      { src: settings.menuCarouselImage4, alt: 'Spicy chicken wings', hint: 'chicken wings' },
  ]

  const productRatings = useMemo(() => {
    if (reviewsLoading) return {};
    const ratings: Record<string, { total: number; count: number; average: number }> = {};

    allReviews.forEach((review: Review) => {
      if (!ratings[review.productId]) {
        ratings[review.productId] = { total: 0, count: 0, average: 0 };
      }
      ratings[review.productId].total += review.rating;
      ratings[review.productId].count++;
    });
    
    for (const productId in ratings) {
        ratings[productId].average = ratings[productId].total / ratings[productId].count;
    }

    return ratings;
  }, [allReviews, reviewsLoading]);


  const sortedProducts = useMemo(() => {
    return [...products].reverse().sort((a, b) => {
        const ratingA = productRatings[a.id]?.average || 0;
        const ratingB = productRatings[b.id]?.average || 0;
        
        if (ratingA > 0 && ratingB > 0) {
            return ratingB - ratingA;
        }
        if (ratingB > 0) return 1;
        if (ratingA > 0) return -1;
        
        return 0;
    });
  }, [products, productRatings]);

  const categoriesForServiceType = useMemo(() => {
    return categories.filter(c => c.serviceType === activeServiceType);
  }, [categories, activeServiceType]);

  const filteredProducts = sortedProducts.filter(product => {
    const productCategory = categories.find(c => c.name === product.category);
    const serviceTypeMatch = productCategory?.serviceType === activeServiceType;
    const categoryMatch = activeCategory === 'all' || product.category.toLowerCase().replace(/\s+/g, '-') === activeCategory;
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return serviceTypeMatch && categoryMatch && searchMatch;
  });

  const isLoading = productsLoading || categoriesLoading || settingsLoading || reviewsLoading || authLoading;

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  if (isLoading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
          <UserHeader />
           <div className="flex-grow">
               <Skeleton className="w-full h-[50vh]" />
               <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
                <div className="flex justify-center space-x-4 p-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-24 w-24 rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
               </div>
           </div>
        </div>
    )
  }

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
                                  quality={75}
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2 font-headline uppercase drop-shadow-lg">
                  Our Menu
                </h1>
                <p className="text-lg text-white/90 drop-shadow-md">
                  Delicious food, groceries, and more, delivered fast to your door.
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                />
                </div>
            </div>

            <div className="flex justify-center gap-2 mb-8 border-b-2 border-primary/20 pb-4">
              <Button 
                size="lg"
                variant={activeServiceType === 'Food' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveServiceType('Food');
                  setActiveCategory('all');
                  setCurrentPage(1);
                }}
                className="rounded-full gap-2 transition-all duration-300"
              >
                <Utensils className="w-5 h-5"/>
                Food
              </Button>
               <Button 
                size="lg"
                variant={activeServiceType === 'Grocery' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveServiceType('Grocery');
                  setActiveCategory('all');
                  setCurrentPage(1);
                }}
                className="rounded-full gap-2 transition-all duration-300"
              >
                <ShoppingBasket className="w-5 h-5"/>
                Grocery
              </Button>
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
                categories={categoriesForServiceType}
                activeCategory={activeCategory}
                setActiveCategory={(category) => {
                  setActiveCategory(category);
                  setCurrentPage(1); // Reset to first page on category change
                }}
                />
            )}

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 min-h-[500px]">
                {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))
                ) : currentProducts.length > 0 ? (
                    currentProducts.map(product => (
                      <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                        <ProductCard 
                          product={product} 
                          rating={productRatings[product.id]?.average || 0}
                          reviewCount={productRatings[product.id]?.count || 0}
                        />
                      </div>
                    ))
                ) : (
                <div className="col-span-full text-center py-16">
                    <Utensils className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h2 className="mt-6 text-2xl font-semibold">No Products Found</h2>
                    <p className="mt-2 text-muted-foreground">Try adjusting your search or category selection.</p>
                </div>
                )}
            </section>

             {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-8">
                <nav aria-label="Pagination">
                  <ul className="flex items-center -space-x-px h-10 text-base">
                    <li>
                      <Button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="rounded-l-lg"
                      >
                        Previous
                      </Button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <li key={number}>
                        <Button
                          onClick={() => paginate(number)}
                           className={cn(
                            "flex items-center justify-center px-4 h-10 leading-tight border-y transition-colors rounded-none",
                            currentPage === number
                              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                              : "bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {number}
                        </Button>
                      </li>
                    ))}
                    <li>
                      <Button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="rounded-r-lg"
                      >
                        Next
                      </Button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
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

        {selectedProduct && (
          <ProductDetailDialog 
            product={selectedProduct} 
            isOpen={!!selectedProduct}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setSelectedProduct(null);
              }
            }}
          />
        )}
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

    
