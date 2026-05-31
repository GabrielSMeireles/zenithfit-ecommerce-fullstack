// =============================================================================
// ZENITH - Gestão de Pedido e Troca Completa
// Cenário: Admin confirma pagamento → coloca em transporte → confirma entrega.
//          Cliente solicita troca de item. Admin autoriza, confirma recebimento
//          e o sistema gera cupom de troca automaticamente.
// Pré-condição: Pedido #3 já existe no banco.
// =============================================================================

const COMMAND_DELAY = 3000;

Cypress.on('command:start', () => {
  return new Promise((resolve) => setTimeout(resolve, COMMAND_DELAY));
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  return originalFn(element, text, { delay: 10, ...options });
});

Cypress.Commands.overwrite('click', (originalFn, element, options) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(originalFn(element, options)), 100);
  });
});

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(originalFn(url, options)), 100);
  });
});

// ---------------------------------------------------------------------------
const PEDIDO_ID = 3;

// ---------------------------------------------------------------------------
describe('Gestão de Pedido e Troca - 7ª Entrega', () => {

  // ══════════════════════════════════════════════════════════════════════════
  // PARTE 1 — ADMINISTRADOR: Aprovar → Transportar → Entregar
  // ══════════════════════════════════════════════════════════════════════════
  it('Admin confirma pagamento, envia para transporte e confirma entrega', () => {

    cy.intercept('PATCH', `**/pedidos/${PEDIDO_ID}/status`).as('atualizarStatus');

    // ── Gestão de Pedidos: navega direto para o detalhamento do pedido #3 ──
    cy.visit(`src/Front-End/employerSide/DetalhamentoPedido.html?id=${PEDIDO_ID}`);

    // ── Detalhamento do Pedido ───────────────────────────────────────────────
    cy.url().should('include', 'DetalhamentoPedido.html');

    // Stub de alert para não bloquear o fluxo
    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

    // 1. Aprovar Pedido (confirma pagamento)
    cy.contains('button', 'Aprovar Pedido').click();
    cy.wait('@atualizarStatus');

    // 2. Enviar para Transporte (tela atualiza sozinha após aprovação)
    cy.contains('button', 'Enviar para Transporte').should('be.visible').click();
    cy.wait('@atualizarStatus');

    // 3. Confirmar Entrega (tela atualiza sozinha após transporte)
    cy.contains('button', 'Confirmar Entrega').should('be.visible').click();
    cy.wait('@atualizarStatus');

    // Fecha o modal de entrega confirmada
    cy.contains('button', 'Fechar').should('be.visible').click();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PARTE 2 — CLIENTE: Solicita troca de item do pedido #3
  // ══════════════════════════════════════════════════════════════════════════
  it('Cliente solicita troca de item no pedido #3', () => {

    cy.intercept('POST', '**/login').as('loginRequest');
    cy.intercept('POST', '**/trocas').as('criarTroca');

    // ── Login do cliente ─────────────────────────────────────────────────────
    cy.visit('src/Front-End/costumerSide/telaLogin.html');
    cy.contains('button', 'ENTRAR').click();
    cy.contains('button', 'Cliente').click();
    cy.get('#login-email-address').type('gabriel@email.com');
    cy.get('#login-password').type('Senha@123');
    cy.get('button[type="submit"]').contains('Entrar como Cliente').click();
    cy.wait('@loginRequest');

    // ── Detalhes do Pedido: navega direto com query param ───────────────────
    cy.visit(`src/Front-End/costumerSide/detalhesDoPedido.html?id=${PEDIDO_ID}`);
    cy.url().should('include', 'detalhesDoPedido.html');

    // Stub de alert
    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

    // Aguarda os detalhes do pedido carregarem
    cy.get('#container-pedido').should('not.contain', 'Carregando');

    // Abre o modal de troca
    cy.contains('button', 'Solicitar Troca').scrollIntoView().click();

    // Aguarda o modal ficar visível (openExchangeModal remove a classe 'hidden')
    cy.get('#exchangeModal').should('not.have.class', 'hidden');

    // Interage com os elementos visíveis dentro do modal
    cy.get('#reason').should('be.visible').select('cor');

    // Confirma a troca (force necessário pois o modal fixed pode ser interceptado por outro elemento)
    cy.contains('button', 'Confirmar Troca').click({ force: true });
    cy.wait('@criarTroca').its('response.statusCode').should('be.oneOf', [200, 201]);

    // Fecha o alert de confirmação
    cy.get('@alertStub').should('have.been.calledOnce');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // PARTE 3 — ADMINISTRADOR: Autoriza troca e confirma recebimento
  //           (sistema gera cupom de troca automaticamente)
  // ══════════════════════════════════════════════════════════════════════════
  it('Admin autoriza troca, confirma recebimento e sistema gera cupom', () => {

    cy.intercept('PATCH', '**/trocas/**').as('atualizarTroca');

    // ── Gestão de Trocas: localiza a troca pelo número do pedido e clica em Detalhar ──
    cy.visit('src/Front-End/employerSide/GestaoTrocas.html');

    // A tabela carrega via DOMContentLoaded + fetch — aguarda com timeout maior
    cy.contains('td', `#${PEDIDO_ID}`, { timeout: 10000 })
      .closest('tr')
      .contains('a', 'Detalhar')
      .click();

    // ── Detalhamento da Troca ────────────────────────────────────────────────
    cy.url().should('include', 'DetalhamentoTroca.html');

    // Stub de alert
    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

    // 1. Autorizar Troca
    cy.contains('button', 'Autorizar Troca').click();
    cy.wait('@atualizarTroca');
    cy.get('@alertStub').should('have.been.calledOnce');

    // 2. Confirmar Recebimento do produto devolvido
    cy.contains('button', 'Confirmar Recebimento').should('be.visible').click();
    cy.wait('@atualizarTroca');

    // O sistema gera o cupom automaticamente após confirmar recebimento
    cy.get('@alertStub').should('have.been.calledTwice');
  });
});