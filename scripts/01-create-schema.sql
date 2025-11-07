-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS TABLE - Authentication with NIST SP 800-63B compliance
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  password_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- DONORS TABLE - Rastreabilidade de Doadores e Lotes
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL, -- pessoa_fisica, pessoa_juridica, international
  name VARCHAR(255) NOT NULL,
  cpf_cnpj VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  country VARCHAR(100),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CATEGORIES TABLE - Product Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- DONATION BATCHES TABLE - Lotes de Doações
CREATE TABLE public.donation_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number VARCHAR(50) UNIQUE NOT NULL,
  donor_id UUID REFERENCES public.donors(id),
  notes_url TEXT, -- URL para nota fiscal ou documentos
  status VARCHAR(50) DEFAULT 'open', -- open, closed, archived
  total_items INTEGER DEFAULT 0,
  total_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ITEMS TABLE - Entrada de Mercadorias
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code VARCHAR(100) UNIQUE NOT NULL,
  batch_id UUID NOT NULL REFERENCES public.donation_batches(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  description VARCHAR(255) NOT NULL,
  size VARCHAR(50),
  condition VARCHAR(50), -- novo, muito_bom, bom, usado
  symbolic_value DECIMAL(10,2) NOT NULL,
  origin VARCHAR(100), -- Renner, Alemanha, Local, Campanha etc
  status VARCHAR(50) DEFAULT 'available', -- available, sold, reserved, damaged
  sold_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RECEIPTS TABLE - Recibos Personalizados
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.users(id),
  payment_method VARCHAR(50) NOT NULL, -- pix, cash
  total_amount DECIMAL(10,2) NOT NULL,
  pix_url TEXT, -- QR Code PIX URL if payment_method is pix
  status VARCHAR(50) DEFAULT 'paid', -- paid, pending, cancelled
  operator_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  printed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RECEIPT ITEMS TABLE - Itens do Recibo
CREATE TABLE public.receipt_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id UUID NOT NULL REFERENCES public.receipts(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id),
  description VARCHAR(255),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SCHEDULING TABLE - Agenda Pública de Agendamentos
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  schedule_date DATE NOT NULL,
  schedule_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, completed, cancelled, no_show
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(schedule_date, schedule_time)
);

-- CAMPAIGNS TABLE - Marketing e Promoções
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50), -- institutional, promotional, seasonal
  start_date DATE,
  end_date DATE,
  target_segment VARCHAR(100), -- all, age_group, frequent_buyers
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CAMPAIGN COMMUNICATIONS TABLE
CREATE TABLE public.campaign_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  channel VARCHAR(50), -- email, whatsapp
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TRANSACTIONS TABLE - Registro de Transações
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id UUID NOT NULL REFERENCES public.receipts(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  transaction_type VARCHAR(50), -- purchase, refund, exchange
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  pix_transaction_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AUDIT LOG TABLE - LGPD Compliance
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  action VARCHAR(255),
  table_name VARCHAR(100),
  record_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_cpf ON public.users(cpf);
CREATE INDEX idx_items_qr_code ON public.items(qr_code);
CREATE INDEX idx_items_batch_id ON public.items(batch_id);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_receipts_customer_id ON public.receipts(customer_id);
CREATE INDEX idx_receipts_created_at ON public.receipts(created_at);
CREATE INDEX idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX idx_schedules_date ON public.schedules(schedule_date);
CREATE INDEX idx_donation_batches_donor_id ON public.donation_batches(donor_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND (
      raw_user_meta_data->>'role' = 'admin' OR 
      raw_user_meta_data->>'role' = 'operator'
    )
  ));

CREATE POLICY "Authenticated users can view items" ON public.items
  FOR SELECT USING (true);

CREATE POLICY "Operators can manage items" ON public.items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND (
      raw_user_meta_data->>'role' = 'operator' OR 
      raw_user_meta_data->>'role' = 'admin'
    )
  ));

CREATE POLICY "Users can view their own receipts" ON public.receipts
  FOR SELECT USING (customer_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND (
      raw_user_meta_data->>'role' = 'operator' OR 
      raw_user_meta_data->>'role' = 'admin'
    )
  ));

CREATE POLICY "Users can view their own schedules" ON public.schedules
  FOR SELECT USING (user_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND (
      raw_user_meta_data->>'role' = 'operator' OR 
      raw_user_meta_data->>'role' = 'admin'
    )
  ));
