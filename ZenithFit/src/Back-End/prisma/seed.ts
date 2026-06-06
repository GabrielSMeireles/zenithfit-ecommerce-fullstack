import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semeio unificado de dados (Sua massa + 13 meses de histórico)...');

  // 1. Limpeza Completa e Controlada na ordem correta das FKs
  await prisma.troca.deleteMany({});
  await prisma.cupom_Pedido.deleteMany({});
  await prisma.pagamento_Pedido.deleteMany({});
  await prisma.item_Pedido.deleteMany({});
  await prisma.pedido.deleteMany({});
  await prisma.produto.deleteMany({});
  await prisma.categoria.deleteMany({});
  await prisma.cupom.deleteMany({});
  await prisma.cartao_credito.deleteMany({});
  await prisma.endereco.deleteMany({});
  await prisma.cliente.deleteMany({});
  await prisma.bandeira_cartao.deleteMany({});
  await prisma.status_Pedido.deleteMany({});
  await prisma.status_troca.deleteMany({});
  await prisma.status_cliente.deleteMany({});
  await prisma.tipo_telefone.deleteMany({});
  await prisma.genero.deleteMany({});

  // 2. Inserindo Tabelas Auxiliares da sua massa
  const genFem = await prisma.genero.create({ data: { nm_genero: 'Feminino' } });
  const genMasc = await prisma.genero.create({ data: { nm_genero: 'Masculino' } });
  await prisma.genero.create({ data: { nm_genero: 'Outro' } });
  await prisma.genero.create({ data: { nm_genero: 'Não informar' } });

  const telCel = await prisma.tipo_telefone.create({ data: { nm_tipo_telefone: 'Celular' } });
  await prisma.tipo_telefone.create({ data: { nm_tipo_telefone: 'Residencial' } });
  const telCom = await prisma.tipo_telefone.create({ data: { nm_tipo_telefone: 'Comercial' } });

  const statusAtivo = await prisma.status_cliente.create({ data: { nm_status: 'Ativo' } });
  const statusInativo = await prisma.status_cliente.create({ data: { nm_status: 'Inativo' } });
  await prisma.status_cliente.create({ data: { nm_status: 'Bloqueado' } });

  await prisma.status_troca.createMany({
    data: [
      { nm_status: 'Pendente' },
      { nm_status: 'Autorizada' },
      { nm_status: 'Recusada' },
      { nm_status: 'Finalizada' }
    ]
  });

  const stPedidoEntregue = await prisma.status_Pedido.create({ data: { nm_status: 'Entregue' } });
  await prisma.status_Pedido.create({ data: { nm_status: 'Em processamento' } });
  await prisma.status_Pedido.create({ data: { nm_status: 'Pago' } });
  await prisma.status_Pedido.create({ data: { nm_status: 'Enviado' } });
  await prisma.status_Pedido.create({ data: { nm_status: 'Cancelado' } });

  const fretePac = await prisma.modalidade_Frete.create({ data: { nm_modalidade: 'PAC', vl_fixo: 15.00 } });
  await prisma.modalidade_Frete.create({ data: { nm_modalidade: 'SEDEX', vl_fixo: 25.00 } });
  await prisma.modalidade_Frete.create({ data: { nm_modalidade: 'Retirada na loja', vl_fixo: 0.00 } });

  await prisma.cupom.createMany({
    data: [
      { nm_codigo: 'DESCONTO10', vl_desconto: 10.00, tp_cupom: 'PROMOCIONAL', fl_ativo: true },
      { nm_codigo: 'TROCA20', vl_desconto: 20.00, tp_cupom: 'TROCA', fl_ativo: true }
    ]
  });

  // 3. Criando as Categorias Exigidas para o Filtro de Linhas
  const catAnime = await prisma.categoria.create({ data: { nm_categoria: 'Animes' } });
  const catGeek = await prisma.categoria.create({ data: { nm_categoria: 'Geek e Cultura Pop' } });
  const catBasica = await prisma.categoria.create({ data: { nm_categoria: 'Básicas Premium' } });

  // 4. Cadastrando os Seus 14 Produtos Originais Vinculados às Categorias
  const p1 = await prisma.produto.create({ data: { nm_produto: 'Camisa oversized Mahoraga', ds_produto: 'Camisa oversized com estampa do Mahoraga, shikigami invencível de Jujutsu Kaisen.', vl_produto: 99.99, nm_imagem_url: 'images/mahoraga.png', qt_estoque: 50, cd_categoria: catAnime.cd_categoria } });
  const p2 = await prisma.produto.create({ data: { nm_produto: 'Camisa oversized Zenitsu', ds_produto: 'Camisa oversized do Zenitsu, espadachim do trovão de Demon Slayer.', vl_produto: 99.99, nm_imagem_url: 'images/zenitsu.png', qt_estoque: 40, cd_categoria: catAnime.cd_categoria } });
  const p3 = await prisma.produto.create({ data: { nm_produto: 'Camisa oversized Spider', ds_produto: 'Camisa oversized do Hisoka (Spider), o mago cruel de Hunter x Hunter.', vl_produto: 129.99, nm_imagem_url: 'images/spider.png', qt_estoque: 30, cd_categoria: catAnime.cd_categoria } });
  const p4 = await prisma.produto.create({ data: { nm_produto: 'Camisa oversized Brother', ds_produto: 'Camisa oversized Brother (Ed e Al), alquimia e fraternidade de Fullmetal Alchemist.', vl_produto: 99.99, nm_imagem_url: 'images/brother.png', qt_estoque: 45, cd_categoria: catAnime.cd_categoria } });
  const p5 = await prisma.produto.create({ data: { nm_produto: 'Camisa oversized Limitless', ds_produto: 'Camisa oversized Limitless - inspirada no Gojo Satoru de Jujutsu Kaisen. Técnica ilimitada.', vl_produto: 129.99, nm_imagem_url: 'images/limitless.png', qt_estoque: 35, cd_categoria: catAnime.cd_categoria } });
  const p6 = await prisma.produto.create({ data: { nm_produto: 'Camisa oversized Kokushibo', ds_produto: 'Camisa oversized Kokushibo, Lua Superior Um de Demon Slayer.', vl_produto: 129.99, nm_imagem_url: 'images/kokushibo.png', qt_estoque: 25, cd_categoria: catAnime.cd_categoria } });
  const p7 = await prisma.produto.create({ data: { nm_produto: 'Camisa oversized Toji', ds_produto: 'Camisa oversized Toji Fushiguro, o Assassino de Feiticeiros de Jujutsu Kaisen.', vl_produto: 129.99, nm_imagem_url: 'images/toji.png', qt_estoque: 20, cd_categoria: catAnime.cd_categoria } });
  const p8 = await prisma.produto.create({ data: { nm_produto: 'Camisa oversized Symbol', ds_produto: 'Camisa oversized Symbol - marca da maldição de Berserk ou símbolo oculto.', vl_produto: 129.99, nm_imagem_url: 'images/symbol.png', qt_estoque: 60, cd_categoria: catGeek.cd_categoria } });
  const p9 = await prisma.produto.create({ data: { nm_produto: 'Camiseta oversized Akasa', ds_produto: 'Camiseta oversized Akaza, Lua Superior Três de Demon Slayer.', vl_produto: 129.99, nm_imagem_url: 'images/akasa.png', qt_estoque: 15, cd_categoria: catAnime.cd_categoria } });
  const p10 = await prisma.produto.create({ data: { nm_produto: 'Camiseta oversized Paisagem', ds_produto: 'Camiseta oversized Paisagem - vista serena de montanhas e sol poente.', vl_produto: 129.99, nm_imagem_url: 'images/paisagem.png', qt_estoque: 30, cd_categoria: catGeek.cd_categoria } });
  const p11 = await prisma.produto.create({ data: { nm_produto: 'Camiseta oversized Lisa', ds_produto: 'Camiseta lisa premium, algodão puro, ideal para uso diário e máximo conforto.', vl_produto: 99.99, nm_imagem_url: 'images/lisa.png', qt_estoque: 80, cd_categoria: catBasica.cd_categoria } });
  const p12 = await prisma.produto.create({ data: { nm_produto: 'Camiseta oversized Makima', ds_produto: 'Camiseta oversized da makima de chainsawMan.', vl_produto: 99.99, nm_imagem_url: 'images/makima.png', qt_estoque: 50, cd_categoria: catAnime.cd_categoria } });
  const p13 = await prisma.produto.create({ data: { nm_produto: 'Camiseta oversized Deus', ds_produto: 'Camiseta oversized da estátua do deus do templo de solo levelling.', vl_produto: 99.99, nm_imagem_url: 'images/Deus.png', qt_estoque: 50, cd_categoria: catAnime.cd_categoria } });
  const p14 = await prisma.produto.create({ data: { nm_produto: 'Camiseta oversized Cartas', ds_produto: 'Camiseta oversized de várias cartas do yugi de yugioh', vl_produto: 99.99, nm_imagem_url: 'images/Yugioh.png', qt_estoque: 50, cd_categoria: catGeek.cd_categoria } });

  const listaProdutos = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14];

  // 5. Inserindo Clientes da sua massa
  const c1 = await prisma.cliente.create({ data: { cd_cpf: '123.456.789-00', nm_nome_cliente: 'Gabriel Meireles', dt_nascimento: new Date('1999-05-15'), cd_telefone: '99999-1111', cd_DDD: '11', nm_identificacao_telefone: 'Celular pessoal', nm_email: 'gabriel@email.com', cd_senha: 'Senha@123', cd_rank_cliente: 0, cd_genero: genMasc.cd_genero, cd_tipo_telefone: telCel.cd_tipo_telefone, cd_status: statusAtivo.cd_status } });
  await prisma.cliente.create({ data: { cd_cpf: '234.567.890-11', nm_nome_cliente: 'Ana Costa', dt_nascimento: new Date('1995-08-22'), cd_telefone: '99999-2222', cd_DDD: '21', nm_identificacao_telefone: 'Celular pessoal', nm_email: 'ana@email.com', cd_senha: 'Senha@123', cd_rank_cliente: 1, cd_genero: genFem.cd_genero, cd_tipo_telefone: telCel.cd_tipo_telefone, cd_status: statusAtivo.cd_status } });
  await prisma.cliente.create({ data: { cd_cpf: '345.678.901-22', nm_nome_cliente: 'Carlos Pereira', dt_nascimento: new Date('1988-03-10'), cd_telefone: '99999-3333', cd_DDD: '31', nm_identificacao_telefone: 'Celular comercial', nm_email: 'carlos@email.com', cd_senha: 'Senha@123', cd_rank_cliente: 0, cd_genero: genMasc.cd_genero, cd_tipo_telefone: telCom.cd_tipo_telefone, cd_status: statusAtivo.cd_status } });
  await prisma.cliente.create({ data: { cd_cpf: '456.789.012-33', nm_nome_cliente: 'Maria Oliveira', dt_nascimento: new Date('2001-11-30'), cd_telefone: '99999-4444', cd_DDD: '41', nm_identificacao_telefone: 'Celular pessoal', nm_email: 'maria@email.com', cd_senha: 'Senha@123', cd_rank_cliente: 2, cd_genero: genFem.cd_genero, cd_tipo_telefone: telCel.cd_tipo_telefone, cd_status: statusInativo.cd_status } });
  await prisma.cliente.create({ data: { cd_cpf: '567.890.123-44', nm_nome_cliente: 'Pedro Martins', dt_nascimento: new Date('1993-07-18'), cd_telefone: '99999-5555', cd_DDD: '51', nm_identificacao_telefone: 'Residencial', nm_email: 'pedro@email.com', cd_senha: 'Senha@123', cd_rank_cliente: 0, cd_genero: genMasc.cd_genero, cd_tipo_telefone: telCel.cd_tipo_telefone, cd_status: statusAtivo.cd_status } });

  // 6. Inserindo Endereços vinculados aos CPFs corretos
  const end1 = await prisma.endereco.create({ data: { cd_cep: '01001-000', nm_logradouro: 'Praça da Sé', cd_numero: '100', nm_bairro: 'Sé', nm_cidade: 'São Paulo', sg_estado: 'SP', nm_tipo_endereco: 'Residencial', nm_identificacao: 'Casa', cd_cpf: '123.456.789-00' } });

  // 7. Inserindo Bandeiras e Cartões
  const b1 = await prisma.bandeira_cartao.create({ data: { nm_bandeira: 'Visa' } });
  const cartao1 = await prisma.cartao_credito.create({ data: { cd_numero_cartao: '4111111111111111', nm_nome_impresso_cartao: 'GABRIEL MEIRELES', cd_seguranca: '123', dt_validade_cartao: new Date('2027-12-01'), cartao_preferencial: true, cd_bandeira: b1.cd_bandeira, cd_cpf: '123.456.789-00' } });

  // 8. GERADOR DO HISTÓRICO DE COMPRAS (14 Meses Retroativos Obrigatórios)
  console.log('⏳ Gerando e espalhando histórico de vendas de camisas...');
  const hoje = new Date();

  // Laço iterando de 14 meses atrás até o mês atual
  for (let m = 14; m >= 0; m--) {
    const dataMesRef = new Date(hoje.getFullYear(), hoje.getMonth() - m, 1);
    
    // Sorteia entre 4 e 8 pedidos por mês para dar volume e variação nas linhas do gráfico
    const numPedidosNoMes = Math.floor(Math.random() * 5) + 4;

    for (let p = 0; p < numPedidosNoMes; p++) {
      const diaAleatorio = Math.floor(Math.random() * 27) + 1;
      const dataPedido = new Date(dataMesRef.getFullYear(), dataMesRef.getMonth(), diaAleatorio, 15, 30, 0);

      // Sorteia de 1 a 3 camisas diferentes da sua lista original por carrinho
      const qtdItensDiferentes = Math.floor(Math.random() * 3) + 1;
      const itensParaCriar = [];
      let somaTotalItens = 0;

      for (let i = 0; i < qtdItensDiferentes; i++) {
        const produtoSorteado = listaProdutos[Math.floor(Math.random() * listaProdutos.length)];
        const qtVendida = Math.floor(Math.random() * 3) + 1; // compra de 1 a 3 unidades do mesmo modelo
        const precoItem = Number(produtoSorteado.vl_produto);

        somaTotalItens += (precoItem * qtVendida);

        itensParaCriar.push({
          cd_produto: produtoSorteado.cd_produto,
          qt_item: qtVendida,
          vl_unitario: precoItem,
          nm_tamanho: ['P', 'M', 'G'][Math.floor(Math.random() * 3)]
        });
      }

      const freteFixo = 15.00;
      const valorFinalPedido = somaTotalItens + freteFixo;

      // Cria o pedido temporal
      await prisma.pedido.create({
        data: {
          dt_pedido: dataPedido,
          vl_total: valorFinalPedido,
          vl_frete: freteFixo,
          cd_cpf: c1.cd_cpf,
          cd_endereco: end1.cd_endereco,
          cd_modalidade: fretePac.cd_modalidade,
          cd_status_pedido: stPedidoEntregue.cd_status_pedido,
          itens: {
            create: itensParaCriar
          },
          pagamentos: {
            create: {
              vl_pago: valorFinalPedido,
              cd_cartao: cartao1.cd_cartao
            }
          }
        }
      });
    }
  }

  console.log('✅ Base de dados populada e reconfigurada com a sua massa completa!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });