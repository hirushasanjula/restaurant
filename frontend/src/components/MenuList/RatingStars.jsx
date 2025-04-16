// src/components/MenuList/RatingStars.jsx
import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = () => {
  // Generate a random rating between 3-5 stars
  const rating = Math.floor(3 + Math.random() * 2);
  
  return (
    <>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "text-amber-500 fill-amber-500" : "text-amber-200"}
        />
      ))}
    </>
  );
};

export default RatingStars;