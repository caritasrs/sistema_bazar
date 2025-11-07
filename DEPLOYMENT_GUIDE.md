# Sistema de Gestão Solidária Cáritas RS 3.5

## Visão Geral

Sistema completo para gestão do Bazar Solidário com 7 módulos integrados, conformidade LGPD/NIST e rastreabilidade total.

## Módulos Implementados

### 1. Módulo de Doações (Entrada de Mercadorias)
- Cadastro de doadores (pessoa física, jurídica, internacional)
- Criação de lotes de doação
- Geração automática de QR codes
- Upload de documentos/notas fiscais
- **Endpoints**: `/api/donations/create-batch`, `/api/donations/list`, `/api/donors/create`

### 2. Módulo de Vendas (Saída de Mercadorias)
- Leitor QR code para produtos
- Carrinho de compras interativo
- Suporte para PIX e dinheiro em espécie
- Processamento de checkout
- **Endpoints**: `/api/sales/checkout`, `/api/sales/scan-item`, `/api/sales/pix-qrcode`
- **Página**: `/admin/sales`

### 3. Sistema de Recibos
- Recibos personalizados com branding Cáritas RS
- Otimizado para impressoras térmicas Elgin I9
- Dados institucionais, cliente e itens
- Impressão em HTML/CSS
- **Endpoints**: `/api/receipts/get`, `/api/receipts/print`, `/api/receipts/list`
- **Página**: `/admin/receipts`

### 4. CRM Solidário
- Cadastro completo de clientes (NIST SP 800-63B)
- Histórico de compras e agendamentos
- Busca por nome, email, CPF
- Validação LGPD
- **Endpoints**: `/api/crm/create-customer`, `/api/crm/get-customer`, `/api/crm/get-customer-history`
- **Página**: `/admin/crm`

### 5. Agenda Pública
- Portal de agendamento público: `https://seu-app/agendar`
- Calendário interativo
- Seleção de horários com controle de capacidade
- Notificações por email
- **Endpoints**: `/api/scheduling/available-slots`, `/api/scheduling/create-schedule`, `/api/scheduling/cancel`
- **Páginas**: `/agendar` (público), `/admin/scheduling`

### 6. Marketing e Campanhas
- Criação de campanhas institucionais
- Envio via email e WhatsApp (API)
- Segmentação de público
- Rastreamento de engajamento
- **Endpoints**: `/api/campaigns/create`, `/api/campaigns/send-communication`, `/api/campaigns/list`
- **Página**: `/admin/marketing`

### 7. Relatórios e Analytics
- Dashboard com métricas consolidadas
- Vendas por método de pagamento
- Produtos mais vendidos
- Filtros por período
- Gráficos interativos (Recharts)
- **Endpoints**: `/api/analytics/summary`, `/api/analytics/sales-by-method`, `/api/analytics/top-products`
- **Página**: `/admin/analytics`

### Bônus: Rastreabilidade de Doadores
- Painel de transparência por doador
- Origem → Destino das doações
- Taxa de venda de itens
- Estatísticas por lote
- **Endpoints**: `/api/donors/list`, `/api/donors/get-traceability`
- **Página**: `/admin/donors`

## Arquitetura

### Database (Supabase PostgreSQL)
- 13 tabelas: users, donors, categories, donation_batches, items, receipts, receipt_items, schedules, campaigns, campaign_communications, transactions, audit_logs
- Row Level Security (RLS) habilitado
- Índices para performance
- Auditoria LGPD completa

### Autenticação
- NIST SP 800-63B compliant
- Senhas: 12+ caracteres, maiúsculas, minúsculas, números, especiais
- Validação de CPF
- Email verification

### APIs
- Route Handlers (Next.js)
- Server-side Supabase clients
- Error handling robusto
- CORS ready

### Frontend
- React + TypeScript
- shadcn/ui components
- Tailwind CSS v4
- Recharts para gráficos
- Responsive design

## Deployment (Vercel)

\`\`\`bash
# 1. Clonar repositório
git clone <repo>

# 2. Instalar dependências
npm install

# 3. Configurar env vars
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 4. Deploy
vercel deploy
\`\`\`

## Configuração Supabase

### Executar Scripts SQL
1. Vá para SQL Editor no Supabase
2. Execute: `/scripts/01-create-schema.sql`
3. Verifique que todas as tabelas foram criadas

### Configurar RLS
Políticas RLS já estão no script SQL. Verifique:
- `SELECT` policies para users/items
- `ALL` policies para operators
- `INSERT/UPDATE` policies por user_id

## Primeiros Passos

### 1. Acessar Admin
- URL: `/login`
- Demo: Qualquer email e senha (placeholder)
- Em produção: Integrar com Supabase Auth

### 2. Cadastrar Primeiro Doador
- Menu → Gestão de Doações
- Criar novo doador (pessoa física/jurídica)
- Registrar lote com itens

### 3. Processar Primeira Venda
- Menu → Ponto de Venda
- Escanear QR code do item
- Adicionar ao carrinho
- Processar pagamento (PIX/Dinheiro)
- Visualizar recibo

### 4. Criar Agendamentos
- Público: `/agendar`
- Admin: Ver agenda em `/admin/scheduling`

### 5. Visualizar Relatórios
- Menu → Relatórios
- Filtrar por data
- Analisar métricas

## Integrações Necessárias (Produção)

- **Email**: SendGrid/AWS SES para notificações
- **WhatsApp**: Twilio/Zenvia para campanhas
- **PIX**: Mercado Pago/Stripe para QR dinâmico
- **Impressoras**: API Xprinter XP-365B e Elgin I9
- **Autenticação**: Supabase Auth (OAuth)

## Conformidade

- ✓ LGPD: Auditoria, RLS, controle de dados
- ✓ NIST SP 800-63B: Senhas fortes, validação
- ✓ Segurança: HTTPS, env vars, RLS

## Suporte

- Email: rs@caritas.org.br
- Documentação: `README.md`
- Issues: GitHub repository
