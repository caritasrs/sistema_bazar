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
    <aside className="hidden w-64 border-r border-red-200 md:flex flex-col glass-effect shadow-lg">
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                "text-gray-700 hover:text-red-700 hover:bg-red-50/50 hover:shadow-sm",
                "first:bg-red-50/50 first:text-red-700 first:shadow-sm",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-red-200 p-4">
        <div className="rounded-lg bg-red-50/50 p-4 text-xs border border-red-200 shadow-sm">
          <p className="font-bold text-red-700">Sistema Cáritas RS</p>
          <p className="text-gray-600 mt-1">v3.7</p>
        </div>
      </div>
    </aside>
  )
}
