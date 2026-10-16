'use client';

import { useAuthStore } from '@/store/useAuthStore';
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
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const logout = useAuthStore((s) => s.logout);
    const openAuthModal = useAuthStore((s) => s.openAuthModal);
    const hasHydrated = useAuthStore((s) => s._hasHydrated);

    // Пока стейт читается из localStorage, показываем аккуратную заглушку в размер аватарки
    if (!hasHydrated) {
        return <div className="h-9 w-9 rounded-full bg-muted/60 animate-pulse shrink-0" />;
    }

    // Гостевой режим
    if (!isAuthenticated || !user) {
        return (
            <div>
                <Button onClick={openAuthModal} variant="default" className="cursor-pointer">
                    Войти
                </Button>
            </div>
        );
    }

    // Авторизованный режим
    return (
        <div>
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