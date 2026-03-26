-- Limpar dados existentes (respeitando ordem das foreign keys)
DELETE FROM "Cartao_credito";
DELETE FROM "Endereco";
DELETE FROM "Cliente";
DELETE FROM "Bandeira_cartao";
DELETE FROM "Status_cliente";
DELETE FROM "Tipo_telefone";
DELETE FROM "Genero";

-- Resetar sequences
ALTER SEQUENCE "Genero_cd_genero_seq"                    RESTART WITH 1;
ALTER SEQUENCE "Tipo_telefone_cd_tipo_telefone_seq"      RESTART WITH 1;
ALTER SEQUENCE "Status_cliente_cd_status_seq"            RESTART WITH 1;
ALTER SEQUENCE "Endereco_cd_endereco_seq"                RESTART WITH 1;
ALTER SEQUENCE "Bandeira_cartao_cd_bandeira_seq"         RESTART WITH 1;
ALTER SEQUENCE "Cartao_credito_cd_cartao_seq"            RESTART WITH 1;

-- Tabelas auxiliares
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

-- Clientes
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

-- Endereços
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

-- Bandeiras
INSERT INTO "Bandeira_cartao" (nm_bandeira) VALUES
  ('Visa'),
  ('Mastercard'),
  ('Elo'),
  ('American Express');

-- Cartões
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