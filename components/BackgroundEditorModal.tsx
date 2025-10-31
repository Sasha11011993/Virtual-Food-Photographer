import React, { useState } from 'react';
import { Dish } from '../types';
import Spinner from './Spinner';

interface BackgroundEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEdit: (prompt: string) => Promise<void>;
  dish: Dish;
  imageUrl: string;
}

const BackgroundEditorModal: React.FC<BackgroundEditorModalProps> = ({
  isOpen,
  onClose,
  onApplyEdit,
  dish,
  imageUrl,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleApply = async () => {
    if (!prompt) return;
    setIsEditing(true);
    await onApplyEdit(prompt);
    setIsEditing(false);
    setPrompt('');
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-secondary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-accent">Змінити Фон</h2>
              <p className="text-brand-subtle mt-1">{dish.name}</p>
            </div>
            <button onClick={onClose} className="text-brand-subtle hover:text-brand-text transition-colors">&times;</button>
          </div>
          
          <div className="mt-6">
            <img src={imageUrl} alt={`Editing background for ${dish.name}`} className="w-full rounded-lg aspect-video object-contain bg-brand-primary" />
          </div>

          <div className="mt-6 space-y-4">
            <label htmlFor="background-prompt" className="block text-sm font-medium text-brand-subtle">Опишіть новий фон:</label>
            <input
              id="background-prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="напр., 'чистий білий мармур' або 'старий деревʼяний стіл'"
              className="w-full p-3 bg-brand-primary border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors duration-200 text-brand-text"
              disabled={isEditing}
            />
             <p className="text-xs text-brand-subtle/70">ШІ спробує змінити лише фон, залишивши страву незмінною.</p>
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <button onClick={onClose} disabled={isEditing} className="px-4 py-2 rounded-lg bg-brand-primary text-brand-subtle hover:bg-opacity-80 transition-colors">
              Скасувати
            </button>
            <button 
              onClick={handleApply} 
              disabled={!prompt || isEditing}
              className="px-6 py-2 rounded-lg bg-brand-accent text-brand-primary font-bold hover:bg-yellow-400 transition-colors disabled:bg-brand-subtle/50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Spinner />
                  <span>Оновлення...</span>
                </>
              ) : (
                'Оновити Фон'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundEditorModal;
