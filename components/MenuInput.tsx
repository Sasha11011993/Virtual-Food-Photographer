import React, { useState } from 'react';
import Spinner from './Spinner';
import GenerateIcon from './icons/GenerateIcon';

interface MenuInputProps {
  onGenerate: (menuText: string) => void;
  isLoading: boolean;
}

const MenuInput: React.FC<MenuInputProps> = ({ onGenerate, isLoading }) => {
  const [menuText, setMenuText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(menuText);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-serif font-bold text-brand-accent">Вставте Ваше Меню</h2>
      <p className="text-brand-subtle text-sm -mt-4">
        Введіть ваше меню нижче. Наш ШІ визначить страви та їх описи.
      </p>
      <div>
        <textarea
          value={menuText}
          onChange={(e) => setMenuText(e.target.value)}
          placeholder={`Приклад:\n\nПіца "Маргарита"\nКласична піца зі свіжою моцарелою, томатами та базиліком.\n\nПаста "Карбонара"\nСпагеті з вершковим яєчним соусом, панчетою та сиром пармезан.`}
          className="w-full h-64 p-4 bg-brand-primary border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors duration-200 text-brand-text placeholder-brand-subtle/50 resize-none"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !menuText}
        className="w-full flex items-center justify-center bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-all duration-200 disabled:bg-brand-subtle/50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Обробка меню...</span>
          </>
        ) : (
           <>
             <GenerateIcon />
             <span>Згенерувати Фото</span>
           </>
        )}
      </button>
    </form>
  );
};

export default MenuInput;
