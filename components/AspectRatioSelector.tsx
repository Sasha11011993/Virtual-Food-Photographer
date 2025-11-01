import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedAspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

const ratios: { value: AspectRatio; label: string }[] = [
  { value: '4:3', label: 'Пейзаж (4:3)' },
  { value: '1:1', label: 'Квадрат (1:1)' },
  { value: '16:9', label: 'Банер (16:9)' },
  { value: '3:4', label: 'Портрет (3:4)' },
  { value: '9:16', label: 'Історія (9:16)' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedAspectRatio, onAspectRatioChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-serif font-bold text-brand-accent mb-4">3. Оберіть Співвідношення Сторін</h2>
      <div className="flex flex-wrap gap-3 p-2 bg-brand-secondary rounded-xl">
        {ratios.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => onAspectRatioChange(ratio.value)}
            className={`flex-1 text-sm sm:text-base font-semibold px-4 py-3 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-brand-accent ${
              selectedAspectRatio === ratio.value
                ? 'bg-brand-accent text-brand-primary shadow-md'
                : 'bg-brand-primary text-brand-subtle hover:bg-brand-primary/60'
            }`}
          >
            {ratio.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
