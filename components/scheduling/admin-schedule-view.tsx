"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  AlertCircle,
  Info,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Schedule {
  id: string
  schedule_date: string
  schedule_time: string
  status: string
  notes?: string
  user: {
    name: string
    email: string
    phone: string
    cpf: string
  }
}

const BRAZILIAN_HOLIDAYS_2025 = [
  "2025-01-01", // Ano Novo
  "2025-02-24",
  "2025-02-25", // Carnaval
  "2025-04-18", // Sexta-feira Santa
  "2025-04-21", // Tiradentes
  "2025-05-01", // Dia do Trabalho
  "2025-06-19", // Corpus Christi
  "2025-09-07", // Independência
  "2025-10-12", // Nossa Senhora Aparecida
  "2025-11-02", // Finados
  "2025-11-15", // Proclamação da República
  "2025-12-25", // Natal
]

export function AdminScheduleView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [clientSearch, setClientSearch] = useState("")
  const [clients, setClients] = useState<any[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSchedules()
  }, [selectedDate])

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(`/api/schedules/list?date=${dateStr}`)
      const data = await response.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      console.error("Error fetching schedules:", error)
    } finally {
      setLoading(false)
    }
  }

  const isDateBlocked = (date: Date) => {
    const dayOfWeek = date.getDay()
    const dateStr = date.toISOString().split("T")[0]
    return dayOfWeek === 0 || dayOfWeek === 6 || BRAZILIAN_HOLIDAYS_2025.includes(dateStr)
  }

  const getBlockedReason = (date: Date) => {
    const dayOfWeek = date.getDay()
    const dateStr = date.toISOString().split("T")[0]

    if (dayOfWeek === 0) return "Domingos"
    if (dayOfWeek === 6) return "Sábados"
    if (BRAZILIAN_HOLIDAYS_2025.includes(dateStr)) return "Feriado"
    return ""
  }

  const allTimeSlots: string[] = []
  for (let hour = 8; hour <= 12; hour++) {
    allTimeSlots.push(`${String(hour).padStart(2, "0")}:00:00`)
  }
  for (let hour = 13; hour <= 18; hour++) {
    allTimeSlots.push(`${String(hour).padStart(2, "0")}:00:00`)
  }

  const getSchedulesForSlot = (time: string) => {
    return schedules.filter((s) => s.schedule_time === time)
  }

  const searchClients = async (query: string) => {
    if (query.length < 3) return
    try {
      const response = await fetch(`/api/users/search?q=${query}&role=client`)
      const data = await response.json()
      setClients(data.users || [])
    } catch (error) {
      console.error("Error searching clients:", error)
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return

    try {
      const response = await fetch(`/api/scheduling/delete/${scheduleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({ title: "Agendamento cancelado com sucesso!" })
        fetchSchedules()
      } else {
        toast({ title: "Erro ao cancelar agendamento", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao cancelar agendamento", variant: "destructive" })
    }
  }

  const handleUpdateSchedule = async (scheduleId: string, newTime: string) => {
    try {
      const response = await fetch(`/api/scheduling/update/${scheduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule_time: newTime }),
      })

      if (response.ok) {
        toast({ title: "Agendamento atualizado com sucesso!" })
        setShowEditModal(false)
        fetchSchedules()
      } else {
        toast({ title: "Erro ao atualizar agendamento", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao atualizar agendamento", variant: "destructive" })
    }
  }

  const handleAddSchedule = async () => {
    if (!selectedClient || !selectedTimeSlot) {
      toast({ title: "Selecione um cliente e horário", variant: "destructive" })
      return
    }

    try {
      const response = await fetch("/api/scheduling/create-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedClient.id,
          schedule_date: selectedDate.toISOString().split("T")[0],
          schedule_time: selectedTimeSlot,
          notes: "",
        }),
      })

      if (response.ok) {
        toast({ title: "Agendamento criado com sucesso!" })
        setShowAddModal(false)
        setSelectedClient(null)
        setClientSearch("")
        setClients([])
        fetchSchedules()
      } else {
        const data = await response.json()
        toast({ title: data.error || "Erro ao criar agendamento", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao criar agendamento", variant: "destructive" })
    }
  }

  const blocked = isDateBlocked(selectedDate)
  const blockedReason = getBlockedReason(selectedDate)

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 text-white">
            <Info className="w-6 h-6 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Horário de Funcionamento do Bazar</h3>
              <div className="space-y-1 text-white/90">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    <strong>Manhã:</strong> 8h às 12h (5 horários de 1 hora)
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    <strong>Tarde:</strong> 13h às 18h (6 horários de 1 hora)
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    <strong>Não funcionamos:</strong> Sábados, domingos e feriados
                  </span>
                </p>
                <p className="text-sm">Capacidade: 1 cliente por horário</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6" />
            <CardTitle className="text-2xl">Agenda Completa - Gerenciamento</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() - 1)
                setSelectedDate(newDate)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Dia Anterior
            </Button>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900 capitalize">
                {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              {blocked && (
                <div className="text-red-600 font-semibold flex items-center justify-center gap-2 mt-1">
                  <AlertCircle className="w-4 h-4" />
                  Fechado - {blockedReason}
                </div>
              )}
              <div className="text-sm text-blue-600 mt-1">
                {schedules.length} {schedules.length === 1 ? "agendamento" : "agendamentos"}
              </div>
            </div>
            <Button
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() + 1)
                setSelectedDate(newDate)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              Próximo Dia
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mb-4">
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
              className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700 font-semibold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Ir para Hoje
            </Button>
          </div>
        </CardContent>
      </Card>

      {blocked ? (
        <Card className="bg-red-50 border-2 border-red-300">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Bazar Fechado</h3>
            <p className="text-red-700">O bazar não funciona em {blockedReason.toLowerCase()}.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTimeSlots.map((timeSlot) => {
            const schedulesInSlot = getSchedulesForSlot(timeSlot)
            const capacity = 1
            const available = capacity - schedulesInSlot.length
            const timeDisplay = timeSlot.substring(0, 5)

            return (
              <Card
                key={timeSlot}
                className={`border-2 transition-all ${
                  available === 0 ? "bg-red-50 border-red-300" : "bg-green-50 border-green-300"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-700" />
                      <CardTitle className="text-lg">{timeDisplay}</CardTitle>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        available === 0 ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                      }`}
                    >
                      {available === 0 ? "Ocupado" : "Disponível"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {schedulesInSlot.length === 0 ? (
                    <div className="space-y-2">
                      <div className="text-center text-gray-500 py-2 italic text-sm">Nenhum agendamento</div>
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedTimeSlot(timeSlot)
                          setShowAddModal(true)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agendar Cliente
                      </Button>
                    </div>
                  ) : (
                    <>
                      {schedulesInSlot.map((schedule) => (
                        <div
                          key={schedule.id}
                          className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm space-y-2"
                        >
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 mt-0.5 text-blue-600" />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{schedule.user.name}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{schedule.user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{schedule.user.phone || "Não informado"}</span>
                          </div>
                          {schedule.notes && <div className="text-xs text-gray-500 italic">Obs: {schedule.notes}</div>}
                          <div className="flex gap-2 pt-2 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                setEditingSchedule(schedule)
                                setShowEditModal(true)
                              }}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Data e Horário</Label>
              <p className="font-semibold text-gray-900">
                {selectedDate.toLocaleDateString("pt-BR")} às {selectedTimeSlot.substring(0, 5)}
              </p>
            </div>
            <div>
              <Label htmlFor="client-search">Buscar Cliente</Label>
              <div className="flex gap-2">
                <Input
                  id="client-search"
                  placeholder="Digite nome, email ou CPF..."
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value)
                    searchClients(e.target.value)
                  }}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {clients.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-2">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded cursor-pointer transition-colors ${
                      selectedClient?.id === client.id
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="font-semibold text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-600">{client.email}</div>
                    <div className="text-xs text-gray-500">CPF: {client.cpf}</div>
                  </div>
                ))}
              </div>
            )}
            {selectedClient && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                <div className="font-semibold text-green-900">Cliente Selecionado:</div>
                <div className="text-sm text-green-800">{selectedClient.name}</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddSchedule} disabled={!selectedClient}>
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>
          {editingSchedule && (
            <div className="space-y-4">
              <div>
                <Label>Cliente</Label>
                <p className="font-semibold">{editingSchedule.user.name}</p>
              </div>
              <div>
                <Label htmlFor="new-time">Novo Horário</Label>
                <select
                  id="new-time"
                  className="w-full p-2 border rounded"
                  defaultValue={editingSchedule.schedule_time}
                  onChange={(e) => {
                    if (editingSchedule) {
                      setEditingSchedule({ ...editingSchedule, schedule_time: e.target.value })
                    }
                  }}
                >
                  {allTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot.substring(0, 5)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => editingSchedule && handleUpdateSchedule(editingSchedule.id, editingSchedule.schedule_time)}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
