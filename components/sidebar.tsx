"use client"

import { Package, Users, FileText, BarChart3, Settings, Calendar, Truck, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "Doações",
    icon: Package,
    href: "/donations",
  },
  {
    title: "Beneficiários",
    icon: Users,
    href: "/beneficiaries",
  },
  {
    title: "Recibos",
    icon: FileText,
    href: "/receipts",
  },
  {
    title: "Agendamento",
    icon: Calendar,
    href: "/scheduling",
  },
  {
    title: "Entregas",
    icon: Truck,
    href: "/deliveries",
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: "/reports",
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  return (
    <aside
      className={cn(
        "hidden w-64 border-r border-border bg-white md:flex flex-col",
        "bg-gradient-to-b from-white to-red-50/30", // Adding subtle gradient with 30% transparency
      )}
    >
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-red-50/30",
                "first:bg-red-50/30 first:text-red-700",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-red-50/30 p-3 text-xs text-foreground">
          <p className="font-semibold">Sistema Cáritas RS</p>
          <p className="text-muted-foreground">v3.7</p>
        </div>
      </div>
    </aside>
  )
}
