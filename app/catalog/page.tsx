import { getFilteredTexts } from '@/lib/texts';
import { CatalogView } from '@/components/catalog/catalog-view';

export const metadata = {
  title: 'Каталог материалов | Polyglot Studio',
  description: 'Выберите материал для практики shadowing и аудирования',
};

export default async function CatalogPage() {
  // Чтение данных на сервере
  const materials = await getFilteredTexts({});

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Заголовок и шапка */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Каталог материалов</h1>
        <p className="text-muted-foreground">
          Выберите текст для практики слухового восприятия и теневого повторения (shadowing).
        </p>
      </div>

      {/* Клиентский интерактивный каталог */}
      <CatalogView initialMaterials={materials} />
    </div>
  );
}