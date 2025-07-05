const BASE_URL = 'https://norma.nomoreparties.space/api';
const ID_BUN = `[data-cy="60d3b41abdacab0026a733c6"]`;
const ID_ANOTHER_BUN = `[data-cy="60d3b41abdacab0026a733c7"]`;
const ID_FILLING = `[data-cy="60d3b41abdacab0026a733cb"]`;

const CONSTRUCTOR_AREA = '[data-cy="burger-constructor"]';
const ORDER_BUTTON = '[data-cy="order-button"]';
const PROFILE_LINK = '[data-cy="profile-link"]';
const MODAL_CLOSE_BUTTON = '[data-cy="modal-close-button"]';
const MODAL_OVERLAY = '[data-cy="overlay"]';
const COUNTER_SELECTOR = '.counter__num';
const INGREDIENT_ITEM_SELECTOR = '.constructor-element';

const BUN_NAME = 'Краторная булка N-200i';
const ANOTHER_BUN_NAME = 'Флюоресцентная булка R2-D3';
const FILLING_NAME = 'Биокотлета из марсианской Магнолии';
const USER_NAME = 'TestUser';

describe('Stellar Burger E2E Tests', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');

    cy.intercept('GET', `${BASE_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', `${BASE_URL}/orders`, { fixture: 'order.json' }).as(
      'postOrder'
    );
    cy.intercept('GET', `${BASE_URL}/auth/user`, { fixture: 'user.json' }).as(
      'getUser'
    );

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('#modals').as('modalContainer');
    cy.get(CONSTRUCTOR_AREA).as('constructor');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Adding ingredients', () => {
    it('should add filling and increment counter', () => {
      cy.get(ID_BUN).find('button').contains('Добавить').click();

      cy.get('@constructor').should('not.contain', FILLING_NAME);
      cy.get(ID_FILLING).find(COUNTER_SELECTOR).should('not.exist');

      cy.get(ID_FILLING).find('button').contains('Добавить').click();

      cy.get('@constructor').contains(FILLING_NAME);
      cy.get(ID_FILLING).find(COUNTER_SELECTOR).should('contain', '1');
    });

    it('should add bun', () => {
      cy.get('@constructor').should('not.contain', BUN_NAME);
      cy.get(ID_BUN).find(COUNTER_SELECTOR).should('not.exist');

      cy.get(ID_BUN).find('button').contains('Добавить').click();

      cy.get('@constructor').contains(BUN_NAME);
      cy.get(ID_BUN).find(COUNTER_SELECTOR).should('contain', '2');
    });

    it('should replace bun', () => {
      cy.get(ID_BUN).find('button').contains('Добавить').click();

      cy.get('@constructor').contains(BUN_NAME);
      cy.get('@constructor').should('not.contain', ANOTHER_BUN_NAME);

      cy.get(ID_ANOTHER_BUN).find('button').contains('Добавить').click();

      cy.get('@constructor').contains(ANOTHER_BUN_NAME);
      cy.get('@constructor').should('not.contain', BUN_NAME);
    });
  });

  describe('Order creation', () => {
    it('should create an order, see modal, and clear constructor', () => {
      cy.get(PROFILE_LINK).contains(USER_NAME).should('be.visible');

      cy.get(ID_BUN).find('button').contains('Добавить').click();
      cy.get(ID_FILLING).find('button').contains('Добавить').click();

      cy.get(ORDER_BUTTON).click();

      cy.wait('@postOrder');
      cy.get('@modalContainer').should('not.be.empty');
      cy.get('@modalContainer').find('h2').contains('12345');

      cy.get(MODAL_CLOSE_BUTTON).click();
      cy.get('@modalContainer').should('be.empty');

      cy.get('@constructor').find(INGREDIENT_ITEM_SELECTOR).should('not.exist');
      cy.get('@constructor').contains('Выберите булки').should('exist');
      cy.get('@constructor').contains('Выберите начинку').should('exist');
      cy.get(ID_BUN).find(COUNTER_SELECTOR).should('not.exist');
      cy.get(ID_FILLING).find(COUNTER_SELECTOR).should('not.exist');
    });
  });

  describe('Modal windows', () => {
    it('should open and check ingredient modal data', () => {
      cy.get('@modalContainer').should('be.empty');
      cy.get(ID_FILLING).find('a').click();
      cy.get('@modalContainer').should('not.be.empty');
      cy.url().should('include', '60d3b41abdacab0026a733cb');
      cy.get('@modalContainer').contains(FILLING_NAME);
    });

    it('should close ingredient modal by cross button', () => {
      cy.get(ID_FILLING).find('a').click();
      cy.get('@modalContainer').should('not.be.empty');

      cy.get(MODAL_CLOSE_BUTTON).click();
      cy.get('@modalContainer').should('be.empty');
    });

    it('should close ingredient modal by overlay click', () => {
      cy.get(ID_FILLING).find('a').click();
      cy.get('@modalContainer').should('not.be.empty');

      cy.get(MODAL_OVERLAY).click({ force: true });
      cy.get('@modalContainer').should('be.empty');
    });

    it('should close ingredient modal by Escape key', () => {
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
