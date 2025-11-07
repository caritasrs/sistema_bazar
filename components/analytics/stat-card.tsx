"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: { value: number; label: string }
}

export function StatCard({ title, value, subtitle, trend }: StatCardProps) {
  return (
    <Card className="bg-white/80 border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold text-red-600">{value}</div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        {trend && (
          <div className={`text-xs font-semibold ${trend.value >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
