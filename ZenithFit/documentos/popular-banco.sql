-- =========================================
-- LIMPAR TUDO (ORDEM CORRETA COM FK)
-- =========================================
TRUNCATE TABLE 
  "Cupom_Pedido",
  "Pagamento_Pedido",
  "Item_Pedido",
  "Pedido",
  "Produto",
  "Cupom",
  "Modalidade_Frete",
  "Status_Pedido",
  "Cartao_credito",
  "Endereco",
  "Cliente",
  "Bandeira_cartao",
  "Status_cliente",
  "Tipo_telefone",
  "Genero"
RESTART IDENTITY CASCADE;

-- =========================================
-- TABELAS AUXILIARES
-- =========================================
INSERT INTO "Genero" (nm_genero) VALUES
  ('Feminino'),
  ('Masculino'),
  ('Outro'),
  ('Não informar');

INSERT INTO "Tipo_telefone" (nm_tipo_telefone) VALUES
  ('Celular'),
  ('Residencial'),
  ('Comercial');

INSERT INTO "Status_cliente" (nm_status) VALUES
  ('Ativo'),
  ('Inativo'),
  ('Bloqueado');

-- =========================================
-- CLIENTES
-- =========================================
INSERT INTO "Cliente" (
  cd_cpf, nm_nome_cliente, dt_nascimento, cd_telefone, "cd_DDD",
  nm_identificacao_telefone, nm_email, cd_senha, cd_rank_cliente,
  cd_genero, cd_tipo_telefone, cd_status
) VALUES
  ('123.456.789-00', 'Gabriel Meireles',  '1999-05-15', '99999-1111', '11', 'Celular pessoal',   'gabriel@email.com',  'Senha@123', 0, 2, 1, 1),
  ('234.567.890-11', 'Ana Costa',         '1995-08-22', '99999-2222', '21', 'Celular pessoal',   'ana@email.com',      'Senha@123', 1, 1, 1, 1),
  ('345.678.901-22', 'Carlos Pereira',    '1988-03-10', '99999-3333', '31', 'Celular comercial', 'carlos@email.com',   'Senha@123', 0, 2, 3, 1),
  ('456.789.012-33', 'Maria Oliveira',    '2001-11-30', '99999-4444', '41', 'Celular pessoal',   'maria@email.com',    'Senha@123', 2, 1, 1, 2),
  ('567.890.123-44', 'Pedro Martins',     '1993-07-18', '99999-5555', '51', 'Residencial',       'pedro@email.com',    'Senha@123', 0, 2, 2, 1);

-- =========================================
-- ENDEREÇOS
-- =========================================
INSERT INTO "Endereco" (
  cd_cep, nm_logradouro, cd_numero, nm_bairro,
  nm_cidade, sg_estado, nm_tipo_endereco, nm_identificacao, cd_cpf
) VALUES
  ('01001-000', 'Praça da Sé',          '100', 'Sé',                'São Paulo',       'SP', 'Residencial', 'Casa',      '123.456.789-00'),
  ('01001-000', 'Rua Augusta',          '200', 'Consolação',        'São Paulo',       'SP', 'Cobrança',    'Trabalho',  '123.456.789-00'),
  ('20040-020', 'Rua da Assembleia',    '300', 'Centro',            'Rio de Janeiro',  'RJ', 'Residencial', 'Casa',      '234.567.890-11'),
  ('30112-000', 'Avenida Afonso Pena',  '400', 'Centro',            'Belo Horizonte',  'MG', 'Cobrança',    'Trabalho',  '345.678.901-22'),
  ('80010-010', 'Rua XV de Novembro',   '500', 'Centro',            'Curitiba',        'PR', 'Residencial', 'Casa',      '456.789.012-33'),
  ('90010-150', 'Rua dos Andradas',     '600', 'Centro Histórico',  'Porto Alegre',    'RS', 'Residencial', 'Casa',      '567.890.123-44');

-- =========================================
-- BANDEIRAS
-- =========================================
INSERT INTO "Bandeira_cartao" (nm_bandeira) VALUES
  ('Visa'),
  ('Mastercard'),
  ('Elo'),
  ('American Express');

-- =========================================
-- CARTÕES
-- =========================================
INSERT INTO "Cartao_credito" (
  cd_numero_cartao, nm_nome_impresso_cartao, cd_seguranca,
  dt_validade_cartao, cartao_preferencial, cd_bandeira, cd_cpf
) VALUES
  ('4111111111111111', 'GABRIEL MEIRELES',  '123', '2027-12-01', true,  1, '123.456.789-00'),
  ('4111111111112222', 'GABRIEL MEIRELES',  '456', '2026-06-01', false, 2, '123.456.789-00'),
  ('5500000000001111', 'ANA COSTA',         '321', '2028-03-01', true,  2, '234.567.890-11'),
  ('6011000000002222', 'CARLOS PEREIRA',    '654', '2027-09-01', true,  3, '345.678.901-22'),
  ('3782822463103005', 'MARIA OLIVEIRA',    '7890','2026-11-01', true,  4, '456.789.012-33'),
  ('4111111111113333', 'PEDRO MARTINS',     '789', '2029-01-01', true,  1, '567.890.123-44');

-- =========================================
-- PRODUTOS
-- =========================================
INSERT INTO "Produto" (nm_produto, ds_produto, vl_produto, nm_imagem_url, qt_estoque) VALUES
('Camiseta Oversized Preta', 'Camiseta básica oversized preta', 79.90, '/images/camisa-preta.png', 50),
('Camiseta Oversized Branca', 'Camiseta básica oversized branca', 79.90, '/images/camisa-branca.png', 40),
('Camiseta Estampada Street', 'Estilo streetwear', 99.90, '/images/camisa-street.png', 30),
('Moletom Oversized', 'Moletom confortável', 149.90, '/images/moletom.png', 20);

-- =========================================
-- STATUS PEDIDO
-- =========================================
INSERT INTO "Status_Pedido" (nm_status) VALUES
('Em processamento'),
('Pago'),
('Enviado'),
('Entregue'),
('Cancelado');

-- =========================================
-- FRETE
-- =========================================
INSERT INTO "Modalidade_Frete" (nm_modalidade, vl_fixo) VALUES
('PAC', 15.00),
('SEDEX', 25.00),
('Retirada na loja', 0.00);

-- =========================================
-- CUPONS
-- =========================================
INSERT INTO "Cupom" (nm_codigo, vl_desconto, tp_cupom, fl_ativo) VALUES
('DESCONTO10', 10.00, 'PROMOCIONAL', true),
('TROCA20', 20.00, 'TROCA', true);

-- =========================================
-- PEDIDOS
-- =========================================
INSERT INTO "Pedido" (
  dt_pedido, vl_total, vl_frete,
  cd_cpf, cd_endereco, cd_modalidade, cd_status_pedido
) VALUES
(NOW(), 169.80, 15.00, '123.456.789-00', 1, 1, 1),
(NOW(), 99.90, 25.00, '234.567.890-11', 3, 2, 2);

-- =========================================
-- ITENS
-- =========================================
INSERT INTO "Item_Pedido" (
  qt_item, vl_unitario, nm_tamanho,
  cd_pedido, cd_produto
) VALUES
(1, 79.90, 'M', 1, 1),
(1, 89.90, 'G', 1, 3),
(1, 99.90, 'P', 2, 3);

-- =========================================
-- PAGAMENTOS
-- =========================================
INSERT INTO "Pagamento_Pedido" (
  vl_pago, cd_pedido, cd_cartao
) VALUES
(169.80, 1, 1),
(99.90, 2, 3);

-- =========================================
-- CUPOM PEDIDO
-- =========================================
INSERT INTO "Cupom_Pedido" (
  cd_pedido, cd_cupom
) VALUES
(1, 1);