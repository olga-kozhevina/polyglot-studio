export type Language = 'EN' | 'FR' | 'TR';
export type Level = 'B1' | 'B2' | 'C1';
export type Category = 'Technology' | 'Business' | 'Culture';

export interface Sentence {
  id: string;
  startTime: number; // Время в секундах
  endTime: number;   // Время в секундах
  text: string;
}

export interface TextMaterial {
  id: string;
  title: string;
  description: string;
  targetLanguage: Language;
  level: Level;
  category: Category;
  tagsRu?: string[]; // Теги на русском для поискового индекса
  duration: number; // Общая длительность аудио в секундах
  wordCount: number;
  audioUrl: string;
  coverImage?: string;
  sentences: Sentence[];
}