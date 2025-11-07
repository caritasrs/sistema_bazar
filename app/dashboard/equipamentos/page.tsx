export default function EquipamentosPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-md rounded-2xl p-8 border border-red-300/20 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-2">Equipamentos Compatíveis</h1>
        <p className="text-red-50">Configuração e integração de hardware Elgin com o sistema</p>
      </div>

      {/* Equipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Label Printer */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-md rounded-xl p-6 border border-green-300/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏷️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Impressora de Etiquetas</h3>
              <span className="text-xs bg-green-500/30 text-green-100 px-2 py-1 rounded">Compatível</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">Elgin L42PRO Full</p>
            <p className="text-green-100">✓ Gera e imprime QR Codes 1D/2D</p>
            <p className="text-green-100">✓ Integração via USB/Rede</p>
            <p className="text-green-100">✓ Impressão automática de etiquetas</p>
          </div>
        </div>

        {/* Receipt Printer */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-md rounded-xl p-6 border border-blue-300/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🧾</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Impressora de Recibos</h3>
              <span className="text-xs bg-blue-500/30 text-blue-100 px-2 py-1 rounded">Compatível</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">Elgin I9 (Não Fiscal)</p>
            <p className="text-blue-100">✓ Imprime QR Code PIX</p>
            <p className="text-blue-100">✓ Recibos de doação automáticos</p>
            <p className="text-blue-100">✓ Conexão USB/Bluetooth</p>
          </div>
        </div>

        {/* Scanner */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-md rounded-xl p-6 border border-purple-300/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Leitor Óptico 2D</h3>
              <span className="text-xs bg-purple-500/30 text-purple-100 px-2 py-1 rounded">Compatível</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-white font-semibold">Elgin EL2501</p>
            <p className="text-purple-100">✓ Lê QR Codes e códigos de barras</p>
            <p className="text-purple-100">✓ Suporte USB/Wireless</p>
            <p className="text-purple-100">✓ Leitura rápida no ponto de venda</p>
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-red-900/25 backdrop-blur-md rounded-xl p-8 border border-red-300/20">
        <h2 className="text-2xl font-bold text-white mb-6">Como Integrar os Equipamentos</h2>

        <div className="space-y-6">
          {/* Label Printer Setup */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold text-white mb-2">1. Impressora de Etiquetas (L42PRO)</h3>
            <div className="space-y-2 text-red-50">
              <p>
                <strong className="text-white">Conexão:</strong> USB ou Rede Ethernet
              </p>
              <p>
                <strong className="text-white">Driver:</strong> Instalar Elgin L42PRO Driver (disponível no site Elgin)
              </p>
              <p>
                <strong className="text-white">Configuração no Sistema:</strong>
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Acesse "Gestão do Bazar" → "Entrada de Mercadorias"</li>
                <li>Ao cadastrar produto, clique em "Imprimir Etiqueta"</li>
                <li>O sistema gera QR Code automaticamente e envia para impressora</li>
                <li>Tamanho etiqueta: 50x30mm (configurável)</li>
              </ul>
            </div>
          </div>

          {/* Receipt Printer Setup */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold text-white mb-2">2. Impressora de Recibos (Elgin I9)</h3>
            <div className="space-y-2 text-red-50">
              <p>
                <strong className="text-white">Conexão:</strong> USB ou Bluetooth
              </p>
              <p>
                <strong className="text-white">Driver:</strong> Instalar Elgin I9 Driver
              </p>
              <p>
                <strong className="text-white">Configuração no Sistema:</strong>
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Acesse "Recibos" para configurar impressora</li>
                <li>Suporta impressão de QR Code PIX automático</li>
                <li>Recibos de doação com logo Cáritas</li>
                <li>Largura papel: 58mm ou 80mm</li>
              </ul>
            </div>
          </div>

          {/* Scanner Setup */}
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-semibold text-white mb-2">3. Leitor Óptico (EL2501)</h3>
            <div className="space-y-2 text-red-50">
              <p>
                <strong className="text-white">Conexão:</strong> USB (plug and play) ou Wireless
              </p>
              <p>
                <strong className="text-white">Driver:</strong> Reconhecido automaticamente como teclado
              </p>
              <p>
                <strong className="text-white">Uso no Sistema:</strong>
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Acesse "Gestão do Bazar" → "Vendas"</li>
                <li>Posicione cursor no campo de busca</li>
                <li>Escaneie QR Code do produto</li>
                <li>Produto é adicionado automaticamente ao carrinho</li>
                <li>Suporta múltiplas leituras rápidas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-red-900/25 backdrop-blur-md rounded-xl p-8 border border-red-300/20">
        <h2 className="text-2xl font-bold text-white mb-6">Especificações Técnicas</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-red-300/20">
                <th className="text-left py-3 px-4 text-white font-semibold">Equipamento</th>
                <th className="text-left py-3 px-4 text-white font-semibold">Modelo</th>
                <th className="text-left py-3 px-4 text-white font-semibold">Interface</th>
                <th className="text-left py-3 px-4 text-white font-semibold">Velocidade</th>
                <th className="text-left py-3 px-4 text-white font-semibold">Formato QR</th>
              </tr>
            </thead>
            <tbody className="text-red-50">
              <tr className="border-b border-red-300/10">
                <td className="py-3 px-4">Impressora Etiquetas</td>
                <td className="py-3 px-4">Elgin L42PRO Full</td>
                <td className="py-3 px-4">USB, Ethernet, Serial</td>
                <td className="py-3 px-4">127mm/s</td>
                <td className="py-3 px-4">QR Code 1D/2D</td>
              </tr>
              <tr className="border-b border-red-300/10">
                <td className="py-3 px-4">Impressora Recibos</td>
                <td className="py-3 px-4">Elgin I9</td>
                <td className="py-3 px-4">USB, Bluetooth</td>
                <td className="py-3 px-4">250mm/s</td>
                <td className="py-3 px-4">QR PIX, 1D/2D</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Leitor Óptico</td>
                <td className="py-3 px-4">Elgin EL2501</td>
                <td className="py-3 px-4">USB, Wireless</td>
                <td className="py-3 px-4">300 leituras/s</td>
                <td className="py-3 px-4">QR 1D/2D, EAN, Code128</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-md rounded-xl p-6 border border-green-300/20">
          <h3 className="text-xl font-bold text-white mb-4">✓ Vantagens da Integração</h3>
          <ul className="space-y-2 text-green-100">
            <li>→ Agilidade no atendimento e vendas</li>
            <li>→ Redução de erros no cadastro</li>
            <li>→ Rastreabilidade completa de produtos</li>
            <li>→ Impressão automática de etiquetas e recibos</li>
            <li>→ Controle de estoque em tempo real</li>
            <li>→ Geração de QR Code PIX instantâneo</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-md rounded-xl p-6 border border-orange-300/20">
          <h3 className="text-xl font-bold text-white mb-4">⚙️ Suporte Técnico</h3>
          <div className="space-y-3 text-red-50">
            <p>
              <strong className="text-white">Drivers e Manuais:</strong>
            </p>
            <p className="text-sm">
              Baixe em:{" "}
              <a
                href="https://elgin.com.br"
                target="_blank"
                className="text-orange-300 hover:text-orange-200 underline"
                rel="noreferrer"
              >
                elgin.com.br
              </a>
            </p>

            <p className="mt-4">
              <strong className="text-white">Configuração Personalizada:</strong>
            </p>
            <p className="text-sm">
              Entre em contato com o suporte técnico da Cáritas para configuração assistida dos equipamentos no seu
              ambiente
            </p>

            <p className="mt-4">
              <strong className="text-white">Testes:</strong>
            </p>
            <p className="text-sm">
              Use a área de testes no menu "Gestão do Bazar" para validar funcionamento dos equipamentos
            </p>
          </div>
        </div>
      </div>

      {/* System Compatibility Note */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-md rounded-xl p-6 border border-blue-300/20">
        <div className="flex items-start gap-4">
          <div className="text-3xl">ℹ️</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Compatibilidade do Sistema</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              O Sistema Bazar Cáritas foi desenvolvido com suporte nativo para equipamentos Elgin. O sistema utiliza
              padrões web para impressão (via window.print() e ESC/POS) e leitura de QR Code via input de teclado,
              garantindo compatibilidade plug-and-play com os modelos listados. Não é necessário software adicional além
              dos drivers oficiais Elgin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
