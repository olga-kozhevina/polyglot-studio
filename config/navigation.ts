import { Library, Headphones, LayoutDashboard, Home, BookMarked } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  requiresAuth: boolean
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Главная',
    href: '/',
    icon: Home,
    requiresAuth: false
  },
  { label: 'Каталог', href: '/catalog', icon: Library, requiresAuth: false },
  { label: 'Тренировка речи', href: '/reader', icon: Headphones, requiresAuth: false },
  { label: 'Словарь', href: '/vocabulary', icon: BookMarked, requiresAuth: true },
  { label: 'Прогресс', href: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
]
