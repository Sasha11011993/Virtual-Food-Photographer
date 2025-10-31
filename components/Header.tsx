import React from 'react';
import CameraIcon from './icons/CameraIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 border-b border-brand-secondary">
          <div className="flex items-center space-x-4">
            <div className="text-brand-accent">
              <CameraIcon />
            </div>
            <h1 className="text-2xl font-bold font-serif text-brand-text tracking-wider">
              Віртуальний Фуд-Фотограф
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;