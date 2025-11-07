# Sistema de Gestão Solidária Cáritas RS 3.5

Plataforma digital completa para o Bazar Solidário com gestão de doações, vendas simbólicas, CRM, agendamentos e análises.

## Instalação

\`\`\`bash
npm install
npm run dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000)

## Features

- 7 módulos integrados e funcionais
- Conformidade LGPD e NIST
- Rastreabilidade total de doações
- Portal de agendamento público
- Dashboard analítico completo
- Recibos personalizados com branding
- CRM com histórico de clientes
- Campanhas de marketing

## Estrutura de Pastas

\`\`\`
.
├── app/
│   ├── page.tsx (home pública)
│   ├── login/page.tsx
│   ├── admin/ (páginas admin)
│   ├── (public)/agendar/page.tsx
│   └── api/ (rotas/endpoints)
├── components/
│   ├── ui/ (shadcn components)
│   ├── donation/
│   ├── sales/
│   ├── receipt/
│   ├── crm/
│   ├── scheduling/
│   ├── campaigns/
│   └── analytics/
├── lib/
│   ├── supabase.ts (client)
│   ├── supabase-server.ts (server)
│   ├── auth.ts (validação)
│   ├── password-utils.ts
│   └── format-utils.ts
├── scripts/
│   └── 01-create-schema.sql (database)
└── middleware.ts (autenticação)
\`\`\`

## Endpoints Principais

### Doações
- `POST /api/donations/create-batch` - Criar lote
- `GET /api/donations/list` - Listar lotes

### Vendas
- `POST /api/sales/checkout` - Processar venda
- `POST /api/sales/scan-item` - Ler QR code

### Recibos
- `GET /api/receipts/get` - Buscar recibo
- `POST /api/receipts/print` - Log de impressão

### CRM
- `POST /api/crm/create-customer` - Criar cliente
- `GET /api/crm/list-customers` - Listar clientes

### Agendamentos
- `GET /api/scheduling/available-slots` - Horários
- `POST /api/scheduling/create-schedule` - Agendar

### Analytics
- `GET /api/analytics/summary` - Resumo
- `GET /api/analytics/sales-by-method` - Vendas

## Páginas Principais

### Públicas
- `/` - Home com features
- `/agendar` - Portal de agendamento
- `/login` - Login admin

### Admin
- `/admin` - Dashboard principal
- `/admin/donations` - Gestão de doações
- `/admin/sales` - Ponto de venda
- `/admin/crm` - Gestão de clientes
- `/admin/receipts` - Recibos
- `/admin/scheduling` - Agenda
- `/admin/marketing` - Campanhas
- `/admin/analytics` - Relatórios
- `/admin/donors` - Rastreabilidade

## Variáveis de Ambiente

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=key_...
SUPABASE_SERVICE_ROLE_KEY=key_...
SUPABASE_JWT_SECRET=secret_...
\`\`\`

## Banco de Dados

PostgreSQL via Supabase com:
- 13 tabelas
- RLS habilitado
- Índices para performance
- Auditoria LGPD

Execute script para criar schema:
\`\`\`bash
# Via Supabase SQL Editor
# Copie conteúdo de: scripts/01-create-schema.sql
\`\`\`

## Build & Deploy

\`\`\`bash
# Build
npm run build

# Deploy Vercel
vercel deploy

# Deploy Docker
docker build -t caritas-rs .
docker run -p 3000:3000 caritas-rs
\`\`\`

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- Recharts (gráficos)
- shadcn/ui
- Vercel

## Licença

Proprietary - Cáritas Brasileira Regional RS

## Suporte

Email: rs@caritas.org.br
