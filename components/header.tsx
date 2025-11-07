"use client"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CaritasLogo } from "./caritas-logo"

export function Header() {
  return (
    <header className="border-b border-red-200 glass-effect px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-red-50">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg bg-white p-2 shadow-md">
              <CaritasLogo className="h-full w-full" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-red-700">CÁRITAS BRASILEIRA</h1>
              <p className="text-xs text-red-600 font-medium">Rio Grande do Sul</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
