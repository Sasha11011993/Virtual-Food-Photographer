import React from 'react';
import { Dish } from '../types';
import ImageCard from './ImageCard';
import Spinner from './Spinner';

interface ImageGalleryProps {
  dishes: Dish[];
  images: Record<string, string | null>;
  isLoading: boolean;
  onEdit: (dish: Dish) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ dishes, images, isLoading, onEdit }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-brand-secondary rounded-2xl min-h-[300px]">
        <Spinner />
        <p className="mt-4 text-brand-subtle">Обробляємо ваше меню...</p>
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-brand-secondary rounded-2xl min-h-[300px]">
        <h3 className="text-lg font-bold text-brand-text">Ваша віртуальна фотосесія чекає</h3>
        <p className="mt-2 text-brand-subtle">
          Вставте ваше меню та натисніть "Згенерувати Фото", щоб побачити магію.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {dishes.map((dish) => (
        <ImageCard 
          key={dish.name} 
          dish={dish} 
          imageUrl={images[dish.name]} 
          onEdit={() => onEdit(dish)}
        />
      ))}
    </div>
  );
};

export default ImageGallery;