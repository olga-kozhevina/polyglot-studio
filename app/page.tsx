import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Lock, LogIn } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Polyglot Studio</CardTitle>
          <CardDescription>
            Спринт 1: Layout, Zustand и UI-система настроены!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Переключайте языковую пару и тему в шапке сайта. Состояние сохраняется в localStorage.
          </p>
          <Button className="w-full">Тестовая кнопка</Button>
        </CardContent>
      </Card>
    </div>
  )
}