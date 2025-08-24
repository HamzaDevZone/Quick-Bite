'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({ rating, setRating, readOnly = false, size = 24 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleSetRating = (newRating: number) => {
    if (!readOnly && setRating) {
      setRating(newRating);
    }
  };

  const handleMouseEnter = (newRating: number) => {
    if (!readOnly) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            'transition-colors',
            (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground',
            !readOnly && 'cursor-pointer'
          )}
          onClick={() => handleSetRating(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
}
