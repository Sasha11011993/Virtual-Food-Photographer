import React from 'react';
import { ImageStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: ImageStyle;
  onStyleChange: (style: ImageStyle) => void;
}

const styles: ImageStyle[] = ['Світлий/Сучасний', 'Рустика/Темний', 'Для соцмереж'];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-serif font-bold text-brand-accent mb-4">2. Оберіть Стиль</h2>
      <div className="flex flex-wrap gap-3 p-2 bg-brand-secondary rounded-xl">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            className={`flex-1 text-sm sm:text-base font-semibold px-4 py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-accent ${
              selectedStyle === style
                ? 'bg-brand-accent text-brand-primary shadow-md'
                : 'bg-brand-primary text-brand-subtle hover:bg-brand-primary/60'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;