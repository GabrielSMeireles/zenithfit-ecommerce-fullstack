const COMMAND_DELAY = 3000; 

Cypress.on('command:start', (obj) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, COMMAND_DELAY);
  });
});

// Delay
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  return originalFn(element, text, { delay: 100, ...options });
});

describe('Fluxo de Venda Completo - Zenith', () => {
  it('Deve realizar a jornada completa: Login -> Seleção -> Carrinho -> Checkout -> Pagamento', () => {
    
    // --- MOCKS DE API
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.intercept('GET', '**/cupons/**').as('getCupom');
    cy.intercept('POST', '**/pedidos').as('finalizarPedido');

    // --- LOGIN ---
    cy.visit('src/Front-End/costumerSide/telaLogin.html');    
    cy.contains('button', 'ENTRAR').click();
    cy.contains('button', 'Cliente').click();
    cy.get('#login-email-address').type('gabriel@email.com');
    cy.get('#login-password').type('Senha@123');
    cy.get('button[type="submit"]').contains('Entrar como Cliente').click();
    cy.wait('@loginRequest');
    
    // ---  SELEÇÃO DE PRODUTO ---
    cy.url().should('include', 'homepage.html');
    cy.get('#container-novidades').should('not.be.empty');
    // Forçamos o clique caso o card tenha overlays
    cy.contains('h3', 'Camisa oversized Mahoraga').closest('a').click({ force: true });

    // --- DETALHES DO PRODUTO ---
    cy.get('#produto-nome', { timeout: 10000 }).should('not.contain', 'Carregando...');
    cy.get('button[data-tamanho="G"]').click();
    cy.get('#btn-mais').click(); // Qtd vira 2
    cy.get('#btn-carrinho').click();

    // --- CARRINHO ---
    cy.url().should('include', 'carrinho.html');
    cy.get('#container-itens').should('not.contain', 'Carregando...');
    cy.get('#container-itens').within(() => {
      cy.contains('Tamanho: G').should('be.visible');
      cy.contains('2').should('be.visible'); 
    });

    // Alterar quantidade no carrinho (testando lógica de script)
    cy.get('button').contains('add').click();
    cy.get('#resumo-qtd').should('have.text', '3'); // Agora são 3 unidades

    cy.get('#btn-checkout').click();

    // --- CHECKOUT (ENDEREÇO E FRETE) ---
    cy.url().should('include', 'checkout.html');
    
    // Seleciona Endereço
    cy.get('#address-container').should('not.contain', 'Animate-pulse');
    cy.get('input[name="delivery_address"]').first().check();

    // Seleciona Frete
    cy.get('#shipping-options-container').should('not.contain', 'Carregando');
    cy.get('input[name="shipping_method"]').first().check();

    // Valida LocalStorage e Avança
    cy.window().then((win) => {
      expect(win.localStorage.getItem('checkout_id_endereco')).to.not.be.null;
    });
    cy.contains('button', 'Continuar para Pagamento').click();

    // --- PAGAMENTO ---
    cy.url().should('include', 'checkoutPagamento.html');

    // Selecionar Cartão Salvo
    // Espera os cartões carregarem na tela
    cy.get('#cards-container').should('not.contain', 'Carregando');
    cy.get('.card-checkbox').first().check();

    // Preencher o valor no cartão selecionado
    cy.get('#resumo-total').invoke('text').then((textoTotal) => {
      const valorLimpo = textoTotal.replace('R$', '').replace(',', '.').trim();
      
      // Localiza o input de valor do cartão que foi aberto pelo toggleInputValor
      cy.get('.valor-pagamento').filter(':visible').type(valorLimpo);
    });

    // Finalizar Pedido
    cy.get('#paymentForm2').submit();
    cy.wait('@finalizarPedido').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.url().should('include', 'sucessoCompra.html');
    
    
    });
  });