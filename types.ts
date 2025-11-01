export interface Dish {
  name: string;
  description: string;
}

export type ImageStyle = 
  'Рустика/Темний' | 
  'Світлий/Сучасний' | 
  'Для соцмереж' |
  'Вишукана Кухня' |
  'Домашній Затишок' |
  'Яскравий Поп-арт';

// FIX: Add AspectRatio type to be used in AspectRatioSelector.tsx.
export type AspectRatio = '4:3' | '1:1' | '16:9' | '3:4' | '9:16';
