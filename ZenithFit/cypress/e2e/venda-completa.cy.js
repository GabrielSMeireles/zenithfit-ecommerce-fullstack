// =============================================================================
// ZENITH - Fluxo de Venda Completa 
// =============================================================================

const COMMAND_DELAY = 3000;

Cypress.on('command:start', () => {
  return new Promise((resolve) => setTimeout(resolve, COMMAND_DELAY));
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  return originalFn(element, text, { delay: 10, ...options });
});

// ---------------------------------------------------------------------------
// Dados de teste centralizados
// ---------------------------------------------------------------------------
const USUARIO = {
  email: 'gabriel@email.com',
  senha: 'Senha@123',
};

const ENDERECO_NOVO = {
  apelido: 'Escritório Zenith',
  cep: '01310-100',
  logradouro: 'Avenida Paulista',
  numero: '1578',
  bairro: 'Bela Vista',
  cidade: 'São Paulo',
  estado: 'SP',
};

const CARTAO_NOVO = {
  nome: 'GABRIEL S SILVA',
  numero: '5500 0000 0000 0004', 
  validade: '12/2028',
  cvv: '123',
  bandeira: 'Mastercard',
};

const CUPOM = 'DESCONTO10'; // R$ 10,00 de desconto

// ---------------------------------------------------------------------------
describe('Fluxo de Venda Completa - 7ª Entrega', () => {
  it(
    'Cliente seleciona 2 produtos, cadastra endereço e cartão novos, ' +
    'paga com 2 cartões e usa cupom de desconto',
    () => {

      // ── Interceptações de API ──────────────────────────────────────────────
      cy.intercept('POST', '**/login').as('loginRequest');
      cy.intercept('POST', 'http://localhost:3000/enderecos').as('criarEndereco');
      cy.intercept('POST', 'http://localhost:3000/cartoes').as('criarCartao');
      cy.intercept('GET',  '**/cupons/**').as('getCupom');
      cy.intercept('POST', '**/pedidos').as('finalizarPedido');

      // ══════════════════════════════════════════════════════════════════════
      // 1. LOGIN
      // ══════════════════════════════════════════════════════════════════════
      cy.visit('src/Front-End/costumerSide/telaLogin.html');
      cy.contains('button', 'ENTRAR').click();
      cy.contains('button', 'Cliente').click();
      cy.get('#login-email-address').type(USUARIO.email);
      cy.get('#login-password').type(USUARIO.senha);
      cy.get('button[type="submit"]').contains('Entrar como Cliente').click();
      cy.wait('@loginRequest');

      // ══════════════════════════════════════════════════════════════════════
      // 2. PRODUTO 1 — Homepage → Detalhe → Carrinho
      // ══════════════════════════════════════════════════════════════════════
      cy.url().should('include', 'homepage.html');
      cy.get('#container-novidades').should('not.be.empty');

      // Seleciona a Camisa Mahoraga na homepage
      cy.contains('h3', 'Camisa oversized Mahoraga')
        .closest('a')
        .click({ force: true });

      // Página de detalhes — aguarda carregamento
      cy.url().should('include', 'detalhesProduto.html');
      cy.get('#produto-nome', { timeout: 10000 }).should('not.contain', 'Carregando...');

      // Seleciona tamanho M e quantidade 1 (padrão)
      cy.get('button[data-tamanho="M"]').click();

      // Adiciona ao carrinho
      cy.get('#btn-carrinho').click();

      // ══════════════════════════════════════════════════════════════════════
      // 3. CARRINHO — Confirma produto 1 e navega para produto 2
      // ══════════════════════════════════════════════════════════════════════
      cy.url().should('include', 'carrinho.html');
      cy.get('#container-itens').should('not.contain', 'Carregando...');

      // Confirma que o primeiro produto está no carrinho
      cy.get('#container-itens').within(() => {
        cy.contains('Mahoraga').should('be.visible');
      });

      // Continua comprando — link âncora, não botão
      cy.contains('a', 'Continuar comprando').click();

      // ══════════════════════════════════════════════════════════════════════
      // 4. PRODUTO 2 — Página de Produtos → Detalhe → Carrinho
      // ══════════════════════════════════════════════════════════════════════
      cy.url().should('include', 'produtos.html');

      // Busca e seleciona a Camisa Spider
      cy.contains('h3', 'Camisa oversized Spider')
        .closest('a')
        .click({ force: true });

      cy.url().should('include', 'detalhesProduto.html');
      cy.get('#produto-nome', { timeout: 10000 }).should('not.contain', 'Carregando...');

      // Seleciona tamanho G
      cy.get('button[data-tamanho="G"]').click();

      // Adiciona ao carrinho
      cy.get('#btn-carrinho').click();

      // ══════════════════════════════════════════════════════════════════════
      // 5. CARRINHO — Confirma os 2 produtos e avança para checkout
      // ══════════════════════════════════════════════════════════════════════
      cy.url().should('include', 'carrinho.html');
      cy.get('#container-itens').should('not.contain', 'Carregando...');

      // Ambos os produtos devem aparecer
      cy.get('#container-itens').within(() => {
        cy.contains('Mahoraga').should('be.visible');
        cy.contains('Spider').should('be.visible');
      });

      cy.get('#btn-checkout').click();

      // ══════════════════════════════════════════════════════════════════════
      // 6. CHECKOUT — Cadastra novo endereço de entrega
      // ══════════════════════════════════════════════════════════════════════
      cy.url().should('include', 'checkout.html');
      cy.get('#address-container').should('not.contain', 'Animate-pulse');

      // Expande o formulário de novo endereço (span dentro de details/summary)
      cy.contains('span', 'Adicionar novo endereço').click();

      // Tipo de residência — select nativo
      cy.get('#add-residence-type').select('Ambas');

      // Preenche os campos do formulário
      // Como os campos não têm id/name, usamos o placeholder para localizá-los
      cy.get('input[placeholder="Ex: Casa, Apartamento, Zenith Office"]')
        .type(ENDERECO_NOVO.apelido);

      cy.get('input[placeholder="00000-000"]')
        .type(ENDERECO_NOVO.cep);

      cy.get('input[placeholder="Rua, Avenida, etc."]')
        .type(ENDERECO_NOVO.logradouro);

      cy.get('input[placeholder="Ex: 123"]')
        .type(ENDERECO_NOVO.numero);

      cy.get('input[placeholder="Ex: Jardim Botânico"]')
        .type(ENDERECO_NOVO.bairro);

      cy.get('input[placeholder="Ex: São Paulo"]')
        .type(ENDERECO_NOVO.cidade);

      cy.get('input[placeholder="Ex: SP"]')
        .type(ENDERECO_NOVO.estado);

      // Salva o endereço
      cy.contains('button', 'Adicionar Endereço').click();
      cy.wait('@criarEndereco').its('response.statusCode').should('be.oneOf', [200, 201]);

      // O novo endereço deve aparecer como opção selecionável
      cy.get('#address-container').should('contain', ENDERECO_NOVO.apelido);

      // Seleciona o endereço recém-criado
      cy.contains(ENDERECO_NOVO.apelido)
        .closest('label, div')
        .find('input[type="radio"]')
        .check({ force: true });

      // Seleciona a primeira opção de frete disponível
      cy.get('#shipping-options-container').should('not.contain', 'Carregando');
      cy.get('input[name="shipping_method"]').first().check();

      // Confirma que o endereço foi salvo no LocalStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('checkout_id_endereco')).to.not.be.null;
      });

      cy.contains('button', 'Continuar para Pagamento').click();

      // ══════════════════════════════════════════════════════════════════════
      // 7. PAGAMENTO — Aplica cupom de desconto
      // ══════════════════════════════════════════════════════════════════════
      cy.url().should('include', 'checkoutPagamento.html');

      // Stub do alert para não bloquear o JS após aplicar cupom
      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

      // Campo de cupom e aplicação
      cy.get('input[placeholder*="código do cupom"]').type(CUPOM);
      cy.contains('button', 'Aplicar').click();
      cy.wait('@getCupom');

      // Aguarda o alert ser chamado (confirma que aplicarCupom() terminou)
      cy.get('@alertStub').should('have.been.calledOnce');

      // Aguarda o DOM atualizar com o valor com desconto
      cy.get('#resumo-total').should('contain', '234,98');

      // Feedback visual: linha de desconto do cupom aparece no resumo
      cy.contains('Desconto Cupom').should('be.visible');
      cy.contains('- R$ 10,00').should('be.visible');

      // ══════════════════════════════════════════════════════════════════════
      // 8. PAGAMENTO — Cadastra novo cartão
      // ══════════════════════════════════════════════════════════════════════
      cy.get('#cards-container').should('not.contain', 'Carregando');

      // Expande o formulário de novo cartão
      cy.contains('button', 'Adicionar novo cartão').click();

      // Preenche os campos pelos ids (formulário gerado dinamicamente)
      cy.get('#nome_cartao').type(CARTAO_NOVO.nome);
      cy.get('#num_cartao').type(CARTAO_NOVO.numero);

      // Validade é type="date" — navegador espera YYYY-MM-DD
      cy.get('#validade_cartao').type('2028-12-31');

      cy.get('#cvv_cartao').type(CARTAO_NOVO.cvv);

      // Bandeira via select com id
      cy.get('#id_bandeira').select('Mastercard');

      // Salva o cartão
      cy.contains('button', 'Salvar e Usar este Cartão').click();
      cy.wait('@criarCartao').its('response.statusCode').should('be.oneOf', [200, 201]);

      // O novo cartão deve aparecer na lista
      cy.get('#cards-container').should('contain', '0004'); // final do número

      // ══════════════════════════════════════════════════════════════════════
      // 9. PAGAMENTO — Divide o valor entre 2 cartões
      // ══════════════════════════════════════════════════════════════════════
      cy.get('#resumo-subtotal').invoke('text').then((textoSubtotal) => {
       cy.get('#resumo-frete-valor').invoke('text').then((textoFrete) => {
        const subtotalFloat = parseFloat(textoSubtotal.replace('R$','').replace('.','').replace(',','.').trim());
        const freteFloat    = parseFloat(textoFrete.replace('R$','').replace('.','').replace(',','.').trim());
        const totalFloat    = parseFloat((subtotalFloat + freteFloat - 10.00).toFixed(2));
        const metade        = (totalFloat / 2).toFixed(2);
        const restante      = (totalFloat - parseFloat(metade)).toFixed(2);

        // Cartão 1: marca o checkbox, aguarda o input aparecer e preenche
        cy.get('.card-checkbox').eq(0).then(($cb) => {
          const id = $cb.attr('data-id');
          cy.wrap($cb).check({ force: true });
          // Re-query após o check para garantir que o DOM estabilizou
          cy.get(`#input-container-${id}`).should('not.have.class', 'hidden');
          cy.get(`#valor-card-${id}`).should('be.visible').clear().type(metade);
        });

        // Cartão 2: mesmo padrão
        cy.get('.card-checkbox').eq(1).then(($cb) => {
          const id = $cb.attr('data-id');
          cy.wrap($cb).check({ force: true });
          cy.get(`#input-container-${id}`).should('not.have.class', 'hidden');
          cy.get(`#valor-card-${id}`).should('be.visible').clear().type(restante);
        });
       }); 
      }); 

      // ══════════════════════════════════════════════════════════════════════
      // 10. FINALIZA O PEDIDO
      // ══════════════════════════════════════════════════════════════════════
      cy.contains('button[type="submit"]', 'Finalizar Pagamento').click();
      cy.wait('@finalizarPedido')
        .its('response.statusCode')
        .should('be.oneOf', [200, 201]);

      cy.url().should('include', 'sucessoCompra.html');
    }
  );
});