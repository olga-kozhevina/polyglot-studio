'use client';

import { useEffect } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import { TargetLanguage } from '@/store/useSettingsStore';

interface ReaderClientWrapperProps {
  material: {
    id: string;
    title: string;
    level: string;
    targetLanguage: TargetLanguage; // Используем строго строгий тип языка
  };
  children: React.ReactNode;
}

export function ReaderClientWrapper({ material, children }: ReaderClientWrapperProps) {
  const setLastSession = useReaderStore((state) => state.setLastSession);

  useEffect(() => {
    // Сохраняем сессию в словарь по её языку (например: 'EN', 'FR', 'TR')
    setLastSession({
      id: material.id,
      title: material.title,
      level: material.level,
      targetLanguage: material.targetLanguage,
    });
  }, [material, setLastSession]);

  return <>{children}</>;
}