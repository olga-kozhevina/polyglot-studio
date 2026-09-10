'use client';

import { useRef, useEffect } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
    audioUrl: string;
}

const RATES = [0.75, 1.0, 1.25, 1.5];

export const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const {
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        setIsPlaying,
        setCurrentTime,
        setDuration,
        setPlaybackRate,
    } = useReaderStore();

    // Сброс состояния воспроизведения при открытии любой страницы с плеером
    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
    }, [setIsPlaying, setCurrentTime]);

    // Синхронизация воспроизведения (Play/Pause)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            if (audio.currentTime === 0) {
                audio.currentTime = 0;
            }
            const playAudio = async () => {
                try {
                    // Проверяем готовность файла (readyState >= 2 означает, что первые кадры загружены)
                    if (audio.readyState < 2) {
                        await new Promise((resolve) => {
                            audio.oncanplaythrough = resolve;
                        });
                    }
                    await audio.play();
                } catch (error) {
                    console.error('Ошибка воспроизведения:', error);
                    setIsPlaying(false);
                }
            };

            playAudio();
        } else {
            audio.pause();
        }
    }, [isPlaying, setIsPlaying]);

    // Синхронизация скорости воспроизведения
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
            if ('preservesPitch' in audioRef.current) {
      audioRef.current.preservesPitch = true;
    }
        }
    }, [playbackRate]);

    // Обработчики кнопок
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const rewindFiveSeconds = () => {
        if (!audioRef.current) return;
        const newTime = Math.max(0, audioRef.current.currentTime - 5);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleSeek = (value: number[]) => {
        const newTime = value[0];
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
        setCurrentTime(newTime);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed bottom-16 md:bottom-0 left-0 md:left-64 right-0 border-t bg-background/95 backdrop-blur p-3 md:p-4 shadow-lg z-30">
            <audio
                ref={audioRef}
                src={audioUrl}
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="max-w-4xl mx-auto flex flex-col gap-2">
                {/* Seek Bar и время */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-10 text-right">
                        {formatTime(currentTime)}
                    </span>
                    <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground w-10">
                        {formatTime(duration)}
                    </span>
                </div>

                {/* Элементы управления */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button onClick={togglePlay} variant="default" size="icon">
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>

                        <Button onClick={rewindFiveSeconds} variant="outline" size="sm" title="Назад на 5 секунд">
                            <Undo2 className="h-4 w-4 mr-1" />
                            -5s
                        </Button>
                    </div>

                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                        {RATES.map((rate) => {
                            // Проверяем, совпадает ли скорость кнопки с текущей из Zustand
                            const isActive = playbackRate === rate;

                            return (
                                <Button
                                    key={rate}
                                    size="sm"
                                    variant={isActive ? 'default' : 'ghost'}
                                    className={cn(
                                        'text-xs px-2.5 h-7 font-medium transition-all',
                                        isActive && 'shadow-sm font-semibold'
                                    )}
                                    onClick={() => setPlaybackRate(rate)}
                                >
                                    {rate}x
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};