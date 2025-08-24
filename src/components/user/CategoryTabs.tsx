'use client';

import { Button } from '@/components/ui/button';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export function CategoryTabs({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-2 bg-secondary p-1 rounded-full">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'ghost'}
          onClick={() => setActiveCategory('all')}
          className={cn(
            "rounded-full transition-all duration-300",
            activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          )}
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'ghost'}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "rounded-full transition-all duration-300 capitalize",
              activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
