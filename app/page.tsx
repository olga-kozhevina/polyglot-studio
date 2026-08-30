import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-6">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <Card className="w-87.5">
        <CardHeader>
          <CardTitle>Polyglot Studio</CardTitle>
          <CardDescription>Спринт 1: UI-система настроена успешно!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Попробуйте переключить тему в правом верхнем углу экрана.
          </p>
          <Button>Тестовая кнопка</Button>
        </CardContent>
      </Card>
    </main>
  )
}