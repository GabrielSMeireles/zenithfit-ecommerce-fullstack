const COMMAND_DELAY = 5000; 

Cypress.on('command:start', (obj) => {
  // Criamos uma promessa que o Cypress é obrigado a esperar antes de iniciar o comando
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, COMMAND_DELAY);
  });
});

// Mantemos o overwrite do type para as letras aparecerem devagar
Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  return originalFn(element, text, { delay: 100, ...options });
});

describe('Fluxo de Venda Completo - Zenith', () => {
  it('Deve realizar a jornada completa: Login -> Seleção -> Carrinho -> Checkout -> Pagamento', () => {
    
    // --- MOCKS DE API (Prepare os intercepts antes das ações) ---
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.intercept('GET', '**/cupons/**').as('getCupom');
    cy.intercept('POST', '**/pedidos').as('finalizarPedido');

    // --- PARTE 1: LOGIN ---
    cy.visit('http://127.0.0.1:5500/zenithfit2/ZenithFit/src/Front-End/costumerSide/telaLogin.html');    
    cy.contains('button', 'ENTRAR').click();
    cy.contains('button', 'Cliente').click();
    cy.get('#login-email-address').type('gabriel@email.com');
    cy.get('#login-password').type('Senha@123');
    cy.get('button[type="submit"]').contains('Entrar como Cliente').click();
    cy.wait('@loginRequest');
    
    // --- PARTE 2: SELEÇÃO DE PRODUTO ---
    cy.url().should('include', 'homepage.html');
    cy.get('#container-novidades').should('not.be.empty');
    // Forçamos o clique caso o card tenha overlays
    cy.contains('h3', 'Camisa oversized Mahoraga').closest('a').click({ force: true });

    // --- PARTE 3: DETALHES DO PRODUTO ---
    cy.get('#produto-nome', { timeout: 10000 }).should('not.contain', 'Carregando...');
    cy.get('button[data-tamanho="G"]').click();
    cy.get('#btn-mais').click(); // Qtd vira 2
    cy.get('#btn-carrinho').click();

    // --- PARTE 4: CARRINHO ---
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

    // --- PARTE 5: CHECKOUT (ENDEREÇO E FRETE) ---
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

    // --- PARTE 6: PAGAMENTO (A NOVA PARTE) ---
    cy.url().should('include', 'checkoutPagamento.html');

    // 1. Testar aplicação de Cupom (Opcional, mas bom validar)
    cy.intercept('GET', '**/cupons/ZENITH10', {
      statusCode: 200,
      body: { nm_codigo: 'ZENITH10', vl_desconto: 10.00 }
    }).as('aplicarCupom');
    
    cy.get('#input-cupom').type('ZENITH10');
    cy.contains('button', 'Aplicar').click();
    cy.wait('@aplicarCupom');
    cy.get('#resumo-desconto-aside').should('not.contain', 'R$ 0,00');

    // 2. Selecionar Cartão Salvo
    // Espera os cartões carregarem na tela
    cy.get('#cards-container').should('not.contain', 'Carregando');
    cy.get('.card-checkbox').first().check();

    // 3. Preencher o valor no cartão selecionado
    // Pegamos o total final calculado na tela para preencher o input do cartão
    cy.get('#resumo-total').invoke('text').then((textoTotal) => {
      // Limpa a string "R$ 150,00" para "150.00"
      const valorLimpo = textoTotal.replace('R$', '').replace(',', '.').trim();
      
      // Localiza o input de valor do cartão que foi aberto pelo toggleInputValor
      cy.get('.valor-pagamento').filter(':visible').type(valorLimpo);
    });

    // 4. Finalizar Pedido
    cy.get('#paymentForm2').submit();

    // --- PARTE 7: SUCESSO ---
    cy.wait('@finalizarPedido').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.url().should('include', 'sucessoCompra.html');
    
    
    });
  });