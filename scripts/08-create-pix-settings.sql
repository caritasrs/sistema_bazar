-- Create settings table for PIX configuration
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Only admins can manage settings
CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND (
      raw_user_meta_data->>'role' = 'admin' OR 
      raw_user_meta_data->>'role' = 'super_admin'
    )
  ));

-- Insert default PIX settings
INSERT INTO public.settings (key, value, description) VALUES
  ('pix_key', '', 'Chave PIX da Caritas (CPF/CNPJ, e-mail, telefone ou chave aleatória)'),
  ('pix_key_type', 'cnpj', 'Tipo de chave PIX (cpf, cnpj, email, phone, random)'),
  ('institution_name', 'Cáritas RS', 'Nome da instituição'),
  ('institution_city', 'Porto Alegre', 'Cidade da instituição'),
  ('merchant_name', 'Cáritas Brasileira RS', 'Nome do estabelecimento para PIX'),
  ('merchant_city', 'Porto Alegre', 'Cidade do estabelecimento para PIX')
ON CONFLICT (key) DO NOTHING;

CREATE INDEX idx_settings_key ON public.settings(key);
