import { TEXT_MATERIALS } from '@/data/texts';
import { Language, Level, Category, TextMaterial } from '@/types/text';

export async function getFilteredTexts(params: {
  targetLanguage?: Language;
  level?: Level;
  category?: Category;
}): Promise<TextMaterial[]> {
  // Имитация чтения данных с сервера / БД
  let materials = TEXT_MATERIALS;

  if (params.targetLanguage) {
    materials = materials.filter((m) => m.targetLanguage === params.targetLanguage);
  }

  if (params.level) {
    materials = materials.filter((m) => m.level === params.level);
  }

  if (params.category) {
    materials = materials.filter((m) => m.category === params.category);
  }

  return materials;
}