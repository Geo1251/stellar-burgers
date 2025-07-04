const BASE_URL = 'https://norma.nomoreparties.space/api';
const ID_BUN = `[data-cy="60d3b41abdacab0026a733c6"]`;
const ID_ANOTHER_BUN = `[data-cy="60d3b41abdacab0026a733c7"]`;
const ID_FILLING = `[data-cy="60d3b41abdacab0026a733cb"]`;

describe('Stellar Burger E2E Tests', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');

    cy.intercept('GET', `${BASE_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', `${BASE_URL}/orders`, {
      fixture: 'order.json'
    }).as('postOrder');
    cy.intercept('GET', `${BASE_URL}/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('#modals').as('modalContainer');
  });

  describe('Adding ingredients', () => {
    it('should add filling and increment counter', () => {
      cy.get(ID_FILLING).find('button').contains('Добавить').click();
      cy.get(ID_FILLING).find('.counter__num').should('contain', '1');
    });

    it('should add bun', () => {
      cy.get(ID_BUN).find('button').contains('Добавить').click();
      cy.get('[data-cy="burger-constructor"]').contains(
        'Краторная булка N-200i'
      );
      cy.get(ID_BUN).find('.counter__num').should('contain', '2');
    });

    it('should replace bun', () => {
      cy.get(ID_BUN).find('button').contains('Добавить').click();
      cy.get('[data-cy="burger-constructor"]').contains(
        'Краторная булка N-200i'
      );

      cy.get(ID_ANOTHER_BUN).find('button').contains('Добавить').click();
      cy.get('[data-cy="burger-constructor"]').contains(
        'Флюоресцентная булка R2-D3'
      );
      cy.get('[data-cy="burger-constructor"]').should(
        'not.contain',
        'Краторная булка N-200i'
      );
    });
  });

  describe('Order creation', () => {
    it('should create an order and see order number in modal', () => {
      cy.get('[data-cy="profile-link"]')
        .contains('TestUser')
        .should('be.visible');

      cy.get(ID_BUN).find('button').contains('Добавить').click();
      cy.get(ID_FILLING).find('button').contains('Добавить').click();
      cy.get('[data-cy="order-button"]').click();

      cy.wait('@postOrder');

      cy.get('@modalContainer').should('not.be.empty');
      cy.get('@modalContainer').find('h2').contains('12345');
    });
  });

  describe('Modal windows', () => {
    it('should open and check ingredient modal data', () => {
      cy.get('@modalContainer').should('be.empty');
      cy.get(ID_FILLING).find('a').click();
      cy.get('@modalContainer').should('not.be.empty');
      cy.url().should('include', '60d3b41abdacab0026a733cb');
      cy.get('@modalContainer').contains('Биокотлета из марсианской Магнолии');
    });

    it('should close ingredient modal by cross button', () => {
      cy.get('@modalContainer').should('be.empty');
      cy.get(ID_FILLING).find('a').click();
      cy.get('@modalContainer').should('not.be.empty');

      cy.get('[data-cy="modal-close-button"]').click();
      cy.get('@modalContainer').should('be.empty');
    });

    it('should close ingredient modal by overlay click', () => {
      cy.get('@modalContainer').should('be.empty');
      cy.get(ID_FILLING).find('a').click();
      cy.get('@modalContainer').should('not.be.empty');

      cy.get('[data-cy="overlay"]').click({ force: true });
      cy.get('@modalContainer').should('be.empty');
    });

    it('should close ingredient modal by Escape key', () => {
      cy.get('@modalContainer').should('be.empty');
      cy.get(ID_FILLING).find('a').click();
      cy.get('@modalContainer').should('not.be.empty');

      cy.get('body').trigger('keydown', {
        keyCode: 27,
        which: 27,
        key: 'Escape'
      });
      cy.get('@modalContainer').should('be.empty');
    });
  });
});
