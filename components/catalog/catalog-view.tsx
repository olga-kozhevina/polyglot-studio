'use client';

import { useState, useMemo } from 'react';
import { TextMaterial, Category } from '@/types/text';
import { MaterialCard } from './material-card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';

interface CatalogViewProps {
  initialMaterials: TextMaterial[];
}

const CATEGORIES: { id: Category | 'ALL'; label: string; icon: string }[] = [
  { id: 'ALL', label: 'Все темы', icon: '✨' },
  { id: 'Technology', label: 'Technology', icon: '💻' },
  { id: 'Business', label: 'Business', icon: '💼' },
  { id: 'Culture', label: 'Culture', icon: '🏛️' },
];

export function CatalogView({ initialMaterials }: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const { targetLanguage } = useSettingsStore();

  const filteredMaterials = useMemo(() => {
    return initialMaterials.filter((item) => {
      // 1. Фильтр по целевому языку
      const matchesLanguage = item.targetLanguage === targetLanguage;

      // 2. Фильтр по уровню
      const matchesLevel =
        selectedLevel === 'ALL' || item.level === selectedLevel;

      // 3. Фильтр по категории (чипы)
      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      // 4. Поиск: ищет в названии, описании и русских тегах tagsRu
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tagsRu?.some((tag) => tag.toLowerCase().includes(query));

      return matchesLanguage && matchesLevel && matchesCategory && matchesSearch;
    });
  }, [initialMaterials, targetLanguage, selectedLevel, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Поисковая строка и переключатель уровней */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
        <div className="relative w-full xl:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Поиск по темам и русским словам..."
            className="hidden sm:block pl-9 pr-4 text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Input
            type="search"
            placeholder="Поиск по темам и словам..."
            className="block sm:hidden pl-9 pr-4 text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue="ALL"
          value={selectedLevel}
          onValueChange={setSelectedLevel}
          className="w-full xl:w-auto shrink-0"
        >
          <TabsList className="grid w-full grid-cols-4 xl:w-[360px]">
            <TabsTrigger value="ALL" className="text-xs sm:text-sm font-medium px-2 cursor-pointer">Все уровни</TabsTrigger>
            <TabsTrigger value="B1" className="text-xs sm:text-sm cursor-pointer">B1</TabsTrigger>
            <TabsTrigger value="B2" className="text-xs sm:text-sm cursor-pointer">B2</TabsTrigger>
            <TabsTrigger value="C1" className="text-xs sm:text-sm cursor-pointer">C1</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Быстрые чипы категорий */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className="rounded-full text-xs cursor-pointer whitespace-nowrap px-3.5 h-8"
          >
            <span className="mr-1.5">{cat.icon}</span>
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Сетка карточек */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20 space-y-2">
          <p className="text-muted-foreground text-lg font-medium">
            Материалы не найдены
          </p>
          <p className="text-sm text-muted-foreground">
            Попробуйте сбросить фильтры или ввести другое слово в поиске.
          </p>
        </div>
      )}
    </div>
  );
}