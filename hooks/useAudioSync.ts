'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useReaderStore } from '@/store/useReaderStore';

export interface Sentence {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

interface UseAudioSyncOptions {
  sentences: Sentence[];
  currentTime: number;
  setCurrentTime: (time: number) => void;
  autoScroll?: boolean;
}

export function useAudioSync({
  sentences,
  currentTime,
  setCurrentTime,
  autoScroll = true,
}: UseAudioSyncOptions) {
  const setIsPlaying = useReaderStore((state) => state.setIsPlaying);
  const sentenceRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const activeSentence = sentences.find(
    (s) => currentTime >= s.startTime && currentTime <= s.endTime
  );
  const activeId = activeSentence?.id || null;

  // 3. Авто-скролл к активному предложению
  useEffect(() => {
    if (!autoScroll || !activeId) return;

    const el = sentenceRefs.current.get(activeId);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeId, autoScroll]);

  // 4. Перемотка аудио на начало предложения при клике
  const seekToSentence = useCallback(
    (startTime: number) => {
      const audioElement = document.querySelector('audio');
      if (audioElement) {
        audioElement.currentTime = startTime;
        if (audioElement.paused) {
          audioElement.play().catch(() => {});
        }
      }
      setCurrentTime(startTime);
      setIsPlaying(true); 
    },
    [setCurrentTime, setIsPlaying]
  );

  return {
    activeId,
    seekToSentence,
    sentenceRefs,
  };
}