"use client"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg bg-red-600/30 p-1">
              <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 4L40 20H56L44 28L48 44L32 36L16 44L20 28L8 20H24L32 4Z" fill="#DC2626" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground">Cáritas RS</h1>
              <p className="text-xs text-muted-foreground">Bazar Solidário</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Sair</Button>
        </div>
      </div>
    </header>
  )
}
