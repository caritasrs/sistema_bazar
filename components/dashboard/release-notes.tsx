"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Package,
  Receipt,
  Users,
  Megaphone,
  Calendar,
  Gift,
  BarChart3,
  Shield,
  Palette,
  CheckCircle2,
  X,
} from "lucide-react"

interface ReleaseNotesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ReleaseNotesModal({ isOpen, onClose }: ReleaseNotesModalProps) {
  if (!isOpen) return null

  const modules = [
    {
      icon: Shield,
      title: "Sistema de Autenticação e Controle de Acesso",
      color: "bg-blue-500",
      features: [
        "Sistema de login seguro com bcrypt para hash de senhas",
        "4 níveis de acesso: Super Admin, Admin, Operador e Cliente",
        "Controle de permissões por role em todas as rotas",
        "Funcionalidade de troca de senha para todos os perfis",
        "Sessões seguras com cookies httpOnly",
      ],
    },
    {
      icon: Users,
      title: "Módulo 3: Gestão de Usuários e Clientes",
      color: "bg-purple-500",
      features: [
        "Cadastro completo de administradores, operadores e clientes",
        "Busca automática de CEP via API ViaCEP",
        "Listagem separada por tipo de usuário em abas",
        "Rastreamento de origem de cadastro (operador vs auto-cadastro)",
        "Widget no dashboard mostrando clientes auto-cadastrados",
        "Validação de CPF e email únicos",
      ],
    },
    {
      icon: Package,
      title: "Módulo 1: Gestão do Bazar",
      color: "bg-green-500",
      features: [
        "Sistema de vendas com scanner de QR Code",
        "Carrinho de compras inteligente",
        "Cadastro de mercadorias com geração automática de QR Code",
        "Impressão de etiquetas com QR Code",
        "Controle de estoque em tempo real",
        "Gestão de lotes de doações",
        "Filtros e busca avançada de produtos",
        "Categorização de itens do bazar",
      ],
    },
    {
      icon: Receipt,
      title: "Módulo 2: Sistema de Recibos Personalizados",
      color: "bg-yellow-500",
      features: [
        "Geração automática de recibos para vendas",
        "Busca de recibos por período e cliente",
        "Histórico completo de transações",
        "Visualização detalhada de itens vendidos",
        "Integração com sistema de pagamento (PIX/Espécie)",
        "Recibos com logo e identidade visual da Cáritas",
      ],
    },
    {
      icon: Megaphone,
      title: "Módulo 4: Marketing e Promoções",
      color: "bg-pink-500",
      features: [
        "Criação de campanhas promocionais",
        "Gestão de ofertas especiais",
        "Sistema de notificações para clientes",
        "Histórico de campanhas ativas e encerradas",
        "Dashboard com métricas de campanhas",
      ],
    },
    {
      icon: Calendar,
      title: "Módulo 5: Agenda Pública de Agendamentos",
      color: "bg-orange-500",
      features: [
        "Agendamento público via formulário online",
        "Slots de 1 hora em horário comercial (8h-12h e 13h-18h)",
        "Calendário visual mostrando apenas dias com disponibilidade",
        "Sistema de privacidade: clientes públicos veem apenas ocupação",
        "Operadores/admins veem dados completos dos clientes agendados",
        "Controle de capacidade por horário (2 vagas por slot)",
        "Auto-cadastro de clientes ao agendar visita",
        "Design colorido e moderno com gradientes",
      ],
    },
    {
      icon: Gift,
      title: "Módulo 6: Rastreabilidade de Doadores e Lotes",
      color: "bg-indigo-500",
      features: [
        "Cadastro detalhado de doadores",
        "Vinculação de lotes a doadores específicos",
        "Histórico de doações por doador",
        "Rastreamento de mercadorias por lote de origem",
        "Relatórios de impacto por doador",
      ],
    },
    {
      icon: BarChart3,
      title: "Módulo 7: Relatórios e Analytics",
      color: "bg-cyan-500",
      features: [
        "Dashboard com estatísticas em tempo real",
        "Métricas de vendas totais e receita",
        "Controle de estoque disponível",
        "Análise de clientes ativos",
        "Crescimento mensal de vendas",
        "Visitas agendadas por período",
        "Exportação de relatórios",
      ],
    },
    {
      icon: Palette,
      title: "Design e Experiência do Usuário",
      color: "bg-red-500",
      features: [
        "Design moderno com efeito glassmorphism",
        "Paleta de cores oficial da Cáritas (vermelho/branco)",
        "Logo oficial da Cáritas Brasileira Regional RS",
        "Interface responsiva para todos os dispositivos",
        "Animações suaves e transições elegantes",
        "Sidebar e header com transparência e backdrop blur",
        "Feedback visual em todas as ações",
        "Dark mode com contraste otimizado",
      ],
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-red-950/95 to-red-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-red-300/20">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6 border-b border-red-300/20 backdrop-blur-md flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Release Notes</h2>
            <p className="text-red-50 mt-1">Sistema Bazar Cáritas - Versão 1.0.0</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
          {/* Intro */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <p className="text-white text-lg leading-relaxed">
                Bem-vindo ao <span className="font-bold">Sistema Bazar Cáritas</span>, uma plataforma completa
                desenvolvida para gerenciar todas as operações do Bazar Solidário da Cáritas Regional Rio Grande do Sul.
                Este sistema foi projetado com foco em eficiência, segurança e facilidade de uso.
              </p>
            </CardContent>
          </Card>

          {/* Modules */}
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <Card
                key={index}
                className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className={`${module.color} p-3 rounded-xl`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl">{module.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 text-white/90">
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}

          {/* Footer */}
          <Card className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-md border-red-300/20">
            <CardContent className="p-6">
              <p className="text-white text-center text-lg">
                <strong>Desenvolvido com dedicação para a Cáritas Brasileira Regional RS</strong>
              </p>
              <p className="text-red-50 text-center mt-2">
                Sistema implementado em 2025 - Todos os direitos reservados
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function ReleaseNotesCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card
        className="bg-gradient-to-br from-red-600/30 to-orange-600/30 backdrop-blur-md border-red-300/20 hover:from-red-600/40 hover:to-orange-600/40 transition-all cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Release Notes v1.0.0</div>
              <div className="text-sm text-red-50 font-normal">Veja todos os recursos implementados</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 text-sm">
            Clique para visualizar a lista completa de funcionalidades e módulos do Sistema Bazar Cáritas.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">9 Módulos</span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">50+ Features</span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              100% Funcional
            </span>
          </div>
        </CardContent>
      </Card>

      <ReleaseNotesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
