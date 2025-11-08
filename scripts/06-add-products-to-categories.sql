-- Adiciona coluna products à tabela categories para armazenar lista de produtos típicos
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS products TEXT[];

-- Seed de Categorias e Produtos Típicos de Bazar de Roupas e Calçados

-- Roupas Femininas
INSERT INTO public.categories (name, description, products, status) VALUES 
('Roupas Femininas', 'Vestuário feminino em geral', ARRAY[
  'Blusa', 'Camisa', 'Camiseta', 'Regata', 'Top', 'Cropped',
  'Calça Jeans', 'Calça Social', 'Calça Legging', 'Calça Jogger',
  'Saia Curta', 'Saia Longa', 'Saia Midi', 'Saia Jeans',
  'Vestido Curto', 'Vestido Longo', 'Vestido Midi', 'Vestido Social',
  'Short Jeans', 'Short Saia', 'Bermuda',
  'Jaqueta Jeans', 'Jaqueta de Couro', 'Blazer', 'Cardigan',
  'Casaco de Lã', 'Sobretudo', 'Moletom', 'Conjunto Moletom'
], 'active');

-- Roupas Masculinas
INSERT INTO public.categories (name, description, products, status) VALUES 
('Roupas Masculinas', 'Vestuário masculino em geral', ARRAY[
  'Camiseta Básica', 'Camiseta Estampada', 'Camisa Polo', 'Camisa Social',
  'Calça Jeans', 'Calça Social', 'Calça Cargo', 'Calça Sarja',
  'Bermuda Jeans', 'Bermuda Sarja', 'Bermuda Tactel', 'Short',
  'Jaqueta Jeans', 'Jaqueta de Couro', 'Blazer',
  'Moletom', 'Conjunto Moletom', 'Agasalho', 'Corta-Vento',
  'Terno Completo', 'Paletó', 'Colete Social'
], 'active');

-- Roupas Infantis
INSERT INTO public.categories (name, description, products, status) VALUES 
('Roupas Infantis', 'Vestuário infantil (0-12 anos)', ARRAY[
  'Body Bebê', 'Macacão Bebê', 'Pijama Infantil',
  'Camiseta Infantil', 'Blusa Infantil', 'Camisa Infantil',
  'Calça Jeans Infantil', 'Calça Moletom Infantil', 'Legging Infantil',
  'Short Infantil', 'Bermuda Infantil', 'Saia Infantil',
  'Vestido Infantil', 'Jardineira', 'Macacão',
  'Jaqueta Infantil', 'Casaco Infantil', 'Moletom Infantil',
  'Conjunto Infantil', 'Kit Body'
], 'active');

-- Calçados Femininos
INSERT INTO public.categories (name, description, products, status) VALUES 
('Calçados Femininos', 'Sapatos, sandálias e botas femininas', ARRAY[
  'Tênis Casual', 'Tênis Esportivo', 'Tênis de Corrida',
  'Sandália Rasteira', 'Sandália de Salto', 'Sandália Plataforma',
  'Chinelo', 'Chinelo Slide', 'Papete',
  'Sapato Social', 'Scarpin', 'Sapatilha', 'Mocassim',
  'Bota Cano Curto', 'Bota Cano Alto', 'Botina', 'Ankle Boot',
  'Salto Alto', 'Salto Baixo', 'Salto Grosso', 'Salto Fino'
], 'active');

-- Calçados Masculinos
INSERT INTO public.categories (name, description, products, status) VALUES 
('Calçados Masculinos', 'Sapatos, tênis e botas masculinas', ARRAY[
  'Tênis Casual', 'Tênis Esportivo', 'Tênis de Corrida', 'Tênis Skate',
  'Sapato Social', 'Sapato Casual', 'Mocassim', 'Sapatênis',
  'Chinelo', 'Chinelo Slide', 'Sandália Masculina', 'Papete',
  'Bota', 'Botina', 'Coturno', 'Bota de Couro',
  'Chuteira', 'Tênis Futsal'
], 'active');

-- Calçados Infantis
INSERT INTO public.categories (name, description, products, status) VALUES 
('Calçados Infantis', 'Sapatos e tênis infantis', ARRAY[
  'Tênis Infantil', 'Tênis com Luz', 'Tênis Personagem',
  'Sandália Infantil', 'Sandália Papete', 'Chinelo Infantil',
  'Sapato Social Infantil', 'Sapatilha Infantil',
  'Bota Infantil', 'Pantufa', 'Meia Sapatilha'
], 'active');

-- Acessórios Femininos
INSERT INTO public.categories (name, description, products, status) VALUES 
('Acessórios Femininos', 'Bolsas, cintos e acessórios femininos', ARRAY[
  'Bolsa Grande', 'Bolsa Pequena', 'Bolsa Tiracolo', 'Bolsa de Mão',
  'Mochila Feminina', 'Necessaire', 'Carteira', 'Porta-Moedas',
  'Cinto Fino', 'Cinto Largo', 'Cinto Trançado',
  'Lenço', 'Echarpe', 'Chapéu', 'Boné Feminino', 'Gorro',
  'Óculos de Sol', 'Relógio Feminino'
], 'active');

-- Acessórios Masculinos
INSERT INTO public.categories (name, description, products, status) VALUES 
('Acessórios Masculinos', 'Cintos, bonés e acessórios masculinos', ARRAY[
  'Cinto de Couro', 'Cinto de Lona', 'Cinto Social',
  'Mochila Masculina', 'Bolsa Transversal', 'Carteira Masculina',
  'Boné', 'Chapéu', 'Gorro', 'Touca',
  'Gravata', 'Gravata Borboleta', 'Suspensório',
  'Óculos de Sol', 'Relógio Masculino', 'Pulseira'
], 'active');

-- Roupa Íntima Feminina
INSERT INTO public.categories (name, description, products, status) VALUES 
('Íntimas Femininas', 'Lingerie e roupas íntimas femininas', ARRAY[
  'Sutiã', 'Sutiã com Bojo', 'Sutiã sem Bojo', 'Top',
  'Calcinha', 'Calcinha Fio Dental', 'Calcinha Box',
  'Conjunto Lingerie', 'Camisola', 'Pijama Feminino',
  'Robe', 'Penhoar', 'Meia-Calça', 'Meia 3/4'
], 'active');

-- Roupa Íntima Masculina
INSERT INTO public.categories (name, description, products, status) VALUES 
('Íntimas Masculinas', 'Roupas íntimas masculinas', ARRAY[
  'Cueca Boxer', 'Cueca Samba-Canção', 'Cueca Slip',
  'Meia Social', 'Meia Esportiva', 'Meia Cano Alto', 'Meia Cano Baixo',
  'Pijama Masculino', 'Short de Dormir'
], 'active');

-- Roupas Esportivas
INSERT INTO public.categories (name, description, products, status) VALUES 
('Roupas Esportivas', 'Vestuário para prática de esportes', ARRAY[
  'Camiseta Dry Fit', 'Regata Esportiva', 'Top Esportivo',
  'Calça Legging Esportiva', 'Calça de Corrida', 'Short Esportivo',
  'Conjunto Esportivo', 'Agasalho Esportivo', 'Jaqueta Corta-Vento',
  'Bermuda Ciclismo', 'Maiô', 'Sunga', 'Biquíni'
], 'active');

-- Roupas de Inverno
INSERT INTO public.categories (name, description, products, status) VALUES 
('Roupas de Inverno', 'Agasalhos e roupas para frio', ARRAY[
  'Casaco de Lã', 'Casaco de Pelo', 'Sobretudo', 'Trincheira',
  'Jaqueta Acolchoada', 'Jaqueta Puffer', 'Jaqueta Impermeável',
  'Suéter', 'Pulôver', 'Cardigã', 'Poncho',
  'Cachecol', 'Luva', 'Gorro de Lã', 'Manta'
], 'active');
