import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Sidebar } from '@/components/navigation/Sidebar'
import { BottomNav } from '@/components/navigation/BottomNav'
import { HeaderControls } from '@/components/navigation/HeaderControls'
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
  description: "Изучайте английский, французский и турецкий языки через синхронизированное аудирование, умный словарь и повторение слов.",
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
              {/* Шапка: название на мобилках + языки и ThemeToggle */}
              <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur px-4 h-16 flex items-center justify-between md:justify-end">
                <div className="md:hidden font-bold tracking-tight">
                  Polyglot Studio
                </div>
                <HeaderControls />
              </header>

              {/* Содержимое страниц */}
              <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
                {children}
              </main>
            </div>

            {/* Нижняя навигация для мобильных */}
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
