import React, { useState, useCallback } from 'react';
import { Dish, ImageStyle } from './types';
import { parseMenu, generateFoodImage, editImageWithPrompt } from './services/geminiService';

import Header from './components/Header';
import MenuInput from './components/MenuInput';
import StyleSelector from './components/StyleSelector';
import ImageGallery from './components/ImageGallery';
import ImageEditorModal from './components/ImageEditorModal';

type GeneratedImages = Record<string, string | null>;
type EditingState = {
  dish: Dish;
  imageUrl: string;
} | null;


export default function App() {
  const [menuText, setMenuText] = useState<string>('');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [images, setImages] = useState<GeneratedImages>({});
  const [style, setStyle] = useState<ImageStyle>('Світлий/Сучасний');
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingState, setEditingState] = useState<EditingState>(null);

  const handleGenerate = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('Будь ласка, введіть меню.');
      return;
    }
    setError(null);
    setIsLoadingMenu(true);
    setDishes([]);
    setImages({});
    setMenuText(text);

    try {
      const parsedDishes = await parseMenu(text);
      setDishes(parsedDishes);
      setIsLoadingMenu(false);
      setIsGenerating(true);
      
      const initialImages: GeneratedImages = parsedDishes.reduce((acc, dish) => ({ ...acc, [dish.name]: null }), {});
      setImages(initialImages);

      for (const dish of parsedDishes) {
        generateFoodImage(dish, style)
          .then(base64Image => {
            setImages(prev => ({ ...prev, [dish.name]: `data:image/jpeg;base64,${base64Image}` }));
          })
          .catch(err => {
            console.error(`Failed to generate image for ${dish.name}`, err);
            setError(`Не вдалося згенерувати зображення для ${dish.name}. Будь ласка, спробуйте ще раз.`);
            setImages(prev => ({ ...prev, [dish.name]: 'error' }));
          });
      }
    } catch (err) {
      console.error(err);
      setError('Не вдалося розпарсити меню. Будь ласка, перевірте формат і спробуйте ще раз.');
      setIsLoadingMenu(false);
    } finally {
        // This is tricky. We set isGenerating to true and let the loop finish.
        // A more robust solution might use Promise.all and then set isGenerating to false.
        // For this UX, we let it be true while images pop in.
    }
  }, [style]);

  const handleStyleChange = (newStyle: ImageStyle) => {
    setStyle(newStyle);
    if (dishes.length > 0) {
      setImages({});
      setIsGenerating(true);
      const initialImages: GeneratedImages = dishes.reduce((acc, dish) => ({ ...acc, [dish.name]: null }), {});
      setImages(initialImages);

      for (const dish of dishes) {
         generateFoodImage(dish, newStyle)
          .then(base64Image => {
            setImages(prev => ({ ...prev, [dish.name]: `data:image/jpeg;base64,${base64Image}` }));
          })
          .catch(err => {
            console.error(`Failed to generate image for ${dish.name}`, err);
            setError(`Не вдалося згенерувати зображення для ${dish.name}.`);
             setImages(prev => ({ ...prev, [dish.name]: 'error' }));
          });
      }
    }
  };
  
  const handleEditRequest = (dish: Dish) => {
    const imageUrl = images[dish.name];
    if(imageUrl && imageUrl !== 'error') {
      setEditingState({ dish, imageUrl });
    }
  };

  const handleCloseEditor = () => {
    setEditingState(null);
  };

  const handleApplyEdit = async (prompt: string) => {
    if (!editingState) return;

    const { dish, imageUrl } = editingState;
    try {
      const base64Data = imageUrl.split(',')[1];
      const mimeType = imageUrl.substring(imageUrl.indexOf(':') + 1, imageUrl.indexOf(';'));
      
      const editedImageBase64 = await editImageWithPrompt(base64Data, mimeType, prompt);
      
      setImages(prev => ({ ...prev, [dish.name]: `data:image/png;base64,${editedImageBase64}` }));
      handleCloseEditor();
    } catch (err) {
      console.error('Failed to edit image:', err);
      // We can show an error inside the modal. For now, just logging it.
      handleCloseEditor(); // Or keep it open with an error message.
    }
  };


  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Помилка: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-8 bg-brand-secondary p-6 rounded-2xl shadow-lg">
             <MenuInput onGenerate={handleGenerate} isLoading={isLoadingMenu} />
          </div>
          <div className="lg:col-span-2">
            {dishes.length > 0 && (
                <StyleSelector selectedStyle={style} onStyleChange={handleStyleChange} />
            )}
            <ImageGallery 
                dishes={dishes} 
                images={images} 
                isLoading={isLoadingMenu} 
                onEdit={handleEditRequest}
            />
          </div>
        </div>
      </main>
      {editingState && (
        <ImageEditorModal
          isOpen={!!editingState}
          onClose={handleCloseEditor}
          onApplyEdit={handleApplyEdit}
          dish={editingState.dish}
          imageUrl={editingState.imageUrl}
        />
      )}
    </div>
  );
}