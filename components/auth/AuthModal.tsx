'use client';

import { useState, type SyntheticEvent } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    /** Кастомное сообщение, если пользователя перенаправило с защищенного роута */
    reasonMessage?: string | null;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthModal({ 
    isOpen: customIsOpen, 
    onClose: customOnClose, 
    reasonMessage 
}: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isTouched, setIsTouched] = useState(false);

    // Подключаем Zustand стор
    const { isAuthModalOpen, closeAuthModal, login, loginWithGoogle } = useAuthStore();

    // Если пропсы не переданы снаружи — берем состояние из Zustand
    const modalIsOpen = customIsOpen !== undefined ? customIsOpen : isAuthModalOpen;
    const handleCloseAction = customOnClose || closeAuthModal;

    const validateEmail = (value: string) => {
        if (!value.trim()) {
            return 'Email обязателен для заполнения';
        }
        if (!EMAIL_REGEX.test(value.trim())) {
            return 'Введите корректный адрес электронной почты (например, name@example.com)';
        }
        return '';
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (isTouched) {
            setEmailError(validateEmail(value));
        }
    };

    const handleEmailBlur = () => {
        setIsTouched(true);
        setEmailError(validateEmail(email));
    };

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const error = validateEmail(email);
        if (error) {
            setEmailError(error);
            setIsTouched(true);
            return;
        }

        login(email.trim(), name.trim() || undefined);
        resetForm();
        handleCloseAction();
    };

    const resetForm = () => {
        setEmail('');
        setName('');
        setEmailError('');
        setIsTouched(false);
    };

    const handleModalClose = () => {
        resetForm();
        handleCloseAction();
    };

    // Форма невалидна, если есть ошибка или поле банально пустое
    const isFormDisabled = Boolean(validateEmail(email));

    return (
        <Dialog open={modalIsOpen} onOpenChange={handleModalClose}>
            <DialogContent className="sm:max-w-[420px] p-6 gap-5">
                <DialogHeader className="space-y-3 text-left">
                    <DialogTitle className="text-xl font-bold flex self-center gap-2">
                        Вход в Polyglot Studio
                    </DialogTitle>
                    
                    {reasonMessage ? (
                        <div className="flex items-start gap-3 p-3 text-sm rounded-lg bg-primary/10 text-primary border border-primary/20">
                            <Lock className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                            <p className="font-medium leading-relaxed">{reasonMessage}</p>
                        </div>
                    ) : (
                        <DialogDescription className="text-sm text-muted-foreground">
                            Авторизуйтесь, чтобы сохранять слова в личный словарь и отслеживать прогресс обучения.
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => {
                            loginWithGoogle();
                            handleModalClose();
                        }}
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                fill="#EA4335"
                            />
                        </svg>
                        Войти через Google
                    </Button>

                    <div className="relative flex items-center justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground z-10">
                            или по email
                        </span>
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-3">
                            <Input
                                type="text"
                                placeholder="Ваше имя (необязательно)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <div>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={handleEmailBlur}
                                    aria-invalid={isTouched && Boolean(emailError)}
                                    aria-describedby="email-error"
                                    className={cn(
                                        isTouched && emailError && 'border-destructive focus-visible:ring-destructive'
                                    )}
                                />
                                <div className="min-h-[24px] pt-1">
                                    {isTouched && emailError && (
                                        <p id="email-error" className="text-xs font-medium text-destructive">
                                            {emailError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={isFormDisabled}
                            >
                                Продолжить
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}