'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

export function UserNav() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Гостевой режим
    if (!isAuthenticated || !user) {
        return (
            <div suppressHydrationWarning>
                <Button onClick={() => setIsAuthModalOpen(true)} variant="default"
                    className='cursor-pointer'>
                    Войти
                </Button>
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />
            </div>
        );
    }

    // Авторизованный режим
    return (
        <div suppressHydrationWarning>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>
                                {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={logout}
                        className="text-destructive cursor-pointer focus:text-destructive"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Выйти</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}