"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CaritasLogo } from "@/components/caritas-logo"
import { Calendar, ShoppingBag, FileText, BarChart3, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header - Updated with glass effect and modern styling */}
      <header className="glass-effect-red text-white shadow-lg sticky top-0 z-50 border-b border-red-300/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
              <CaritasLogo className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Cáritas RS</h1>
              <p className="text-white/90 text-sm font-medium">Bazar Solidário 3.7</p>
            </div>
          </div>
          <nav className="flex gap-3">
            <Link href="/agendar">
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white/20 bg-transparent backdrop-blur-sm"
              >
                Agendar Visita
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-white/20 hover:bg-white/30 text-white shadow-md backdrop-blur-sm">
                Acesso ao Sistema
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Modernized with glass effect cards */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-8">
        <div className="text-center space-y-6">
          <div className="inline-block glass-effect-red px-6 py-2 rounded-full text-sm font-semibold text-white border border-white/30 shadow-sm backdrop-blur-md">
            Bem-vindo ao Bazar Solidário
          </div>
          <h2 className="text-6xl font-bold text-white drop-shadow-lg text-balance">
            Transformando Vidas com Solidariedade
          </h2>
          <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md text-pretty">
            O Bazar Solidário Cáritas RS oferece produtos a preços simbólicos, garantindo transparência total e
            rastreabilidade de cada doação desde sua origem até você.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/agendar">
              <Button
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white shadow-lg text-base px-8 py-6 backdrop-blur-md border border-white/30"
              >
                Agendar Agora
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="glass-effect-red border-white/40 text-white shadow-lg text-base px-8 py-6 bg-transparent backdrop-blur-md"
            >
              Conheça Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - Added glass morphism effect */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center text-white drop-shadow-lg mb-16">Como Funciona</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-effect-red border-white/20 hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 shadow-md p-2">
                  <CaritasLogo className="w-full h-full" />
                </div>
                <CardTitle className="text-xl text-white">Doações Solidárias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  Recebemos doações de empresas, campanhas e pessoas físicas. Cada item recebe um QR code único para
                  rastreabilidade total.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect-red border-white/20 hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <div className="w-14 h-14 bg-white/20 text-white rounded-xl flex items-center justify-center mb-4 shadow-md backdrop-blur-sm">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl text-white">Compras Simbólicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  Acesse produtos de qualidade a preços acessíveis. Pague via PIX institucional ou dinheiro em espécie e
                  receba recibo oficial.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect-red border-white/20 hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <div className="w-14 h-14 bg-white/20 text-white rounded-xl flex items-center justify-center mb-4 shadow-md backdrop-blur-sm">
                  <FileText className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl text-white">Transparência Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  Acesse relatórios de rastreabilidade, origem de doações e impacto social. Conformidade LGPD e
                  segurança NIST garantidas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section - Modern cards with glass effect */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center text-white drop-shadow-lg mb-16">Funcionalidades Principais</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 glass-effect-red p-8 rounded-xl border border-white/20 hover:shadow-xl transition-all backdrop-blur-md">
              <Calendar className="w-10 h-10 text-white flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Agendamento Online</h4>
                <p className="text-white/90 leading-relaxed">
                  Portal público para agendar sua visita ao Bazar Solidário com horários disponíveis e confirmação por
                  e-mail.
                </p>
              </div>
            </div>

            <div className="flex gap-4 glass-effect-red p-8 rounded-xl border border-white/20 hover:shadow-xl transition-all backdrop-blur-md">
              <Users className="w-10 h-10 text-white flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">CRM Solidário</h4>
                <p className="text-white/90 leading-relaxed">
                  Gerencie seu histórico de compras, agendamentos e interações com a Cáritas RS em um único lugar.
                </p>
              </div>
            </div>

            <div className="flex gap-4 glass-effect-red p-8 rounded-xl border border-white/20 hover:shadow-xl transition-all backdrop-blur-md">
              <BarChart3 className="w-10 h-10 text-white flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Relatórios de Impacto</h4>
                <p className="text-white/90 leading-relaxed">
                  Acompanhe o impacto social do Bazar Solidário com dashboards e análises de desempenho.
                </p>
              </div>
            </div>

            <div className="flex gap-4 glass-effect-red p-8 rounded-xl border border-white/20 hover:shadow-xl transition-all backdrop-blur-md">
              <ShoppingBag className="w-10 h-10 text-white flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-3 text-lg">Vendas Integradas</h4>
                <p className="text-white/90 leading-relaxed">
                  Sistema completo de ponto de venda com leitor QR, carrinho de compras e múltiplos métodos de
                  pagamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Glass effect CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass-effect-red-dark text-white rounded-2xl p-12 text-center space-y-6 border border-white/20 shadow-2xl backdrop-blur-md">
            <h3 className="text-4xl font-bold">Pronto para começar?</h3>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Agende sua visita ao Bazar Solidário e descubra como contribuir para a transformação social através da
              solidariedade e da transparência.
            </p>
            <Link href="/agendar">
              <Button
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white shadow-lg text-base px-8 py-6 backdrop-blur-sm border border-white/30"
              >
                Agendar Visita Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Glass effect footer */}
      <footer className="glass-effect-red text-white py-16 mt-20 border-t border-white/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5">
                  <CaritasLogo className="w-full h-full" />
                </div>
                <h4 className="font-bold text-white text-lg">Cáritas RS</h4>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Bazar Solidário - Transformando vidas com solidariedade.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contato</h4>
              <p className="text-sm text-white/80">R. Cel. André Belo, 452</p>
              <p className="text-sm text-white/80">Porto Alegre, RS</p>
              <p className="text-sm text-white/80">(51) 3222-7000</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Links Úteis</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/agendar" className="text-white/80 hover:text-white transition">
                    Agendar
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-white/80 hover:text-white transition">
                    Acesso ao Sistema
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Informações</h4>
              <p className="text-sm text-white/80">CNPJ: 12.345.678/0001-99</p>
              <p className="text-sm text-white/80">rs.caritas.org.br</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/80">
            <p>© 2025 Cáritas RS. Todos os direitos reservados. Conformidade LGPD garantida.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
