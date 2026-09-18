import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Sidebar } from '@/components/navigation/Sidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { HeaderControls } from '@/components/navigation/HeaderControls';
import { AuthModal } from '@/components/auth/AuthModal';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polyglot Studio",
  description: "Изучайте английский, французский и турецкий языки через синхронизированное аудирование, умный словарь и повторение фраз.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen bg-background">
            {/* Боковое меню на ПК */}
            <Sidebar />

            {/* Основной контентный блок */}
            <div className="md:pl-64 flex flex-col min-h-screen">
              {/* Шапка */}
              <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur px-4 h-16 flex items-center justify-between md:justify-end gap-2 overflow-hidden">
                <Link
                  href="/"
                  className="md:hidden flex items-center gap-2 min-w-0 shrink-0 transition-opacity hover:opacity-80 active:scale-95"
                >
                  <div className="h-7 w-7 aspect-square shrink-0 self-center rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    P
                  </div>
                  <span className="font-bold tracking-tight text-sm leading-tight text-left">
                    Polyglot<span className="block sm:inline"> Studio</span>
                  </span>
                </Link>
                <HeaderControls />
              </header>

              {/* Содержимое страниц */}
              <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
                {children}
              </main>
            </div>

            {/* Нижняя навигация для мобильных */}
            <BottomNav />

            {/* 2. Глобальное окно авторизации */}
            <AuthModal />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}