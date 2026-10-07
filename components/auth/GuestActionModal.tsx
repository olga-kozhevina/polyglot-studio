'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookMarked, LogIn, LucideIcon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface GuestActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  icon?: LucideIcon;
}

export function GuestActionModal({
  isOpen,
  onClose,
  title = 'Сохранение в словарь',
  description = 'Войдите в аккаунт, чтобы сохранять незнакомые слова и фразы.',
  cancelText = 'Отмена',
  confirmText = 'Войти в аккаунт',
  icon: Icon = BookMarked,
}: GuestActionModalProps) {
  const { openAuthModal } = useAuthStore();

  const handleLogin = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие клика к плееру
    onClose();
    openAuthModal();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation(); // Останавливаем всплытие клика к плееру
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        // Гасим любые клики и касания внутри модалки, чтобы они не долетали до предложений
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            {cancelText}
          </Button>
          <Button onClick={handleLogin} className="w-full sm:w-auto gap-2">
            <LogIn className="h-4 w-4" />
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}