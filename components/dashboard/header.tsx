"use client"

interface HeaderProps {
  user: any
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600">
              {user?.role === "super_admin" && "Super Admin"}
              {user?.role === "operator" && "Operador"}
              {user?.role === "client" && "Cliente"}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
