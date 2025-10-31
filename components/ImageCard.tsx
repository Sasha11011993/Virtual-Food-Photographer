import React from 'react';
import { Dish } from '../types';
import Spinner from './Spinner';
import EditIcon from './icons/EditIcon';

interface ImageCardProps {
  dish: Dish;
  imageUrl: string | null;
  onEdit: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ dish, imageUrl, onEdit }) => {
  return (
    <div className="bg-brand-secondary rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-brand-accent/10">
      <div className="relative aspect-[4/3] bg-brand-primary">
        {imageUrl === null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {imageUrl === 'error' && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-4 text-center">
             <p className="font-semibold">Не вдалося згенерувати зображення</p>
             <p className="text-sm">Спробуйте інший стиль або оновіть сторінку.</p>
           </div>
        )}
        {imageUrl && imageUrl !== 'error' && (
          <>
            <img src={imageUrl} alt={dish.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button 
                onClick={onEdit}
                className="flex items-center gap-2 bg-brand-accent text-brand-primary font-bold py-2 px-4 rounded-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
              >
                <EditIcon />
                <span>Редагувати</span>
              </button>
            </div>
          </>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg font-serif text-brand-text truncate">{dish.name}</h3>
        <p className="text-brand-subtle text-sm mt-1 line-clamp-2">{dish.description}</p>
      </div>
    </div>
  );
};

export default ImageCard;