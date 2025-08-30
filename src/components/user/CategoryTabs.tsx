
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { SubCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryTabsProps {
  categories: SubCategory[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export function CategoryTabs({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) {
  if (categories.length === 0) {
    return (
        <div className="text-center py-4 text-sm text-muted-foreground">
            No sub-categories found. Add some from the admin panel!
        </div>
    );
  }

  return (
    <div className="relative border-b-2 border-primary/20">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-2 mx-auto">
            <Button
              variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
              onClick={() => setActiveCategory('all')}
              className={cn(
                "rounded-full transition-all duration-300 h-auto p-3 flex flex-col items-center gap-2",
                activeCategory === 'all' && 'bg-primary/10 text-primary'
              )}
            >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-xl font-bold">All</div>
                <span>All</span>
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'secondary' : 'ghost'}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "rounded-full transition-all duration-300 capitalize h-auto p-3 flex flex-col items-center gap-2",
                  activeCategory === category.id && 'bg-primary/10 text-primary'
                )}
              >
                <Avatar className="w-16 h-16 border-2 border-transparent group-hover:border-primary transition-all">
                  <AvatarImage src={category.iconUrl} alt={category.name} data-ai-hint="category icon"/>
                  <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{category.name}</span>
              </Button>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
