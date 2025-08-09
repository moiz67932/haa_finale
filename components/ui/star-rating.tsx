'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const filled = i < Math.floor(rating)
        const halfFilled = i === Math.floor(rating) && rating % 1 !== 0

        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              filled || halfFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
              interactive && 'cursor-pointer hover:text-yellow-400'
            )}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        )
      })}
    </div>
  )
}
