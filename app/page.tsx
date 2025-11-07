"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Calendar, ShoppingBag, FileText, BarChart3, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cáritas RS</h1>
            <p className="text-red-100 text-sm">Bazar Solidário 3.5</p>
          </div>
          <nav className="flex gap-4">
            <Link href="/agendar">
              <Button variant="outline" className="text-white border-white hover:bg-red-700 bg-transparent">
                Agendar Visita
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-white text-red-600 hover:bg-gray-100">Admin</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
            Bem-vindo ao Bazar Solidário
          </div>
          <h2 className="text-5xl font-bold text-gray-900">Transformando Vidas com Solidariedade</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            O Bazar Solidário Cáritas RS oferece produtos a preços simbólicos, garantindo transparência total e
            rastreabilidade de cada doação desde sua origem até você.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/agendar">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Agendar Agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-red-600 text-red-600 bg-transparent">
              Conheça Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Como Funciona</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-200 bg-white/80 hover:shadow-lg transition">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <CardTitle>Doações Solidárias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Recebemos doações de empresas, campanhas e pessoas físicas. Cada item recebe um QR code único para
                  rastreabilidade total.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-white/80 hover:shadow-lg transition">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <CardTitle>Compras Simbólicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acesse produtos de qualidade a preços acessíveis. Pague via PIX institucional ou dinheiro em espécie e
                  receba recibo oficial.
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-white/80 hover:shadow-lg transition">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <CardTitle>Transparência Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acesse relatórios de rastreabilidade, origem de doações e impacto social. Conformidade LGPD e
                  segurança NIST garantidas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Funcionalidades Principais</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 bg-white/80 p-6 rounded-lg border border-red-200">
              <Calendar className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Agendamento Online</h4>
                <p className="text-gray-600 text-sm">
                  Portal público para agendar sua visita ao Bazar Solidário com horários disponíveis e confirmação por
                  e-mail.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-white/80 p-6 rounded-lg border border-red-200">
              <Users className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">CRM Solidário</h4>
                <p className="text-gray-600 text-sm">
                  Gerencie seu histórico de compras, agendamentos e interações com a Cáritas RS em um único lugar.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-white/80 p-6 rounded-lg border border-red-200">
              <BarChart3 className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Relatórios de Impacto</h4>
                <p className="text-gray-600 text-sm">
                  Acompanhe o impacto social do Bazar Solidário com dashboards e análises de desempenho.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-white/80 p-6 rounded-lg border border-red-200">
              <ShoppingBag className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Vendas Integradas</h4>
                <p className="text-gray-600 text-sm">
                  Sistema completo de ponto de venda com leitor QR, carrinho de compras e múltiplos métodos de
                  pagamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h3 className="text-3xl font-bold">Pronto para começar?</h3>
          <p className="text-lg text-red-100 max-w-2xl mx-auto">
            Agende sua visita ao Bazar Solidário e descubra como contribuir para a transformação social através da
            solidariedade e da transparência.
          </p>
          <Link href="/agendar">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              Agendar Visita Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Cáritas RS</h4>
              <p className="text-sm">Bazar Solidário - Transformando vidas com solidariedade.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contato</h4>
              <p className="text-sm">R. Cel. André Belo, 452</p>
              <p className="text-sm">Porto Alegre, RS</p>
              <p className="text-sm">(51) 3222-7000</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Links Úteis</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/agendar" className="hover:text-white">
                    Agendar
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Informações</h4>
              <p className="text-sm">CNPJ: 12.345.678/0001-99</p>
              <p className="text-sm">rs.caritas.org.br</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>© 2025 Cáritas RS. Todos os direitos reservados. Conformidade LGPD garantida.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
