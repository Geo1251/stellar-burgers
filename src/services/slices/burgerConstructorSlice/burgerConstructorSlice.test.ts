import reducer, {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientInConstructor,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const bunIngredient: TIngredient = {
  _id: '1',
  name: 'Bun',
  type: 'bun',
  price: 100,
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 150,
  image: '',
  image_large: '',
  image_mobile: ''
};
const mainIngredient: TIngredient = {
  _id: '2',
  name: 'Main',
  type: 'main',
  price: 200,
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 250,
  image: '',
  image_large: '',
  image_mobile: ''
};
const mainIngredient2: TIngredient = {
  _id: '3',
  name: 'Main 2',
  type: 'main',
  price: 250,
  proteins: 25,
  fat: 15,
  carbohydrates: 10,
  calories: 300,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('BurgerConstructor Reducer', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addIngredientToConstructor (bun)', () => {
    const action = addIngredientToConstructor(bunIngredient);
    const newState = reducer(initialState, action);
    expect(newState.bun).toEqual(expect.objectContaining(bunIngredient));
    expect(newState.bun?.id).toBeDefined();
  });

  it('should handle addIngredientToConstructor (main)', () => {
    const action = addIngredientToConstructor(mainIngredient);
    const newState = reducer(initialState, action);
    expect(newState.ingredients.length).toBe(1);
    expect(newState.ingredients[0]).toEqual(
      expect.objectContaining(mainIngredient)
    );
    expect(newState.ingredients[0].id).toBeDefined();
  });

  it('should handle removeIngredientFromConstructor', () => {
    const addedAction = addIngredientToConstructor(mainIngredient);
    const stateWithIngredient = reducer(initialState, addedAction);
    const ingredientIdToRemove = stateWithIngredient.ingredients[0].id;

    const removeAction = removeIngredientFromConstructor(ingredientIdToRemove);
    const newState = reducer(stateWithIngredient, removeAction);
    expect(newState.ingredients.length).toBe(0);
  });

  it('should handle moveIngredientInConstructor', () => {
    let state = reducer(
      initialState,
      addIngredientToConstructor(mainIngredient)
    );
    state = reducer(state, addIngredientToConstructor(mainIngredient2));

    expect(state.ingredients[0]).toEqual(
      expect.objectContaining(mainIngredient)
    );
    expect(state.ingredients[1]).toEqual(
      expect.objectContaining(mainIngredient2)
    );

    const moveAction = moveIngredientInConstructor({
      fromIndex: 0,
      toIndex: 1
    });
    const newState = reducer(state, moveAction);

    expect(newState.ingredients[0]).toEqual(
      expect.objectContaining(mainIngredient2)
    );
    expect(newState.ingredients[1]).toEqual(
      expect.objectContaining(mainIngredient)
    );
  });

  it('should handle clearConstructor', () => {
    let state = reducer(
      initialState,
      addIngredientToConstructor(bunIngredient)
    );
    state = reducer(state, addIngredientToConstructor(mainIngredient));
    const newState = reducer(state, clearConstructor());
    expect(newState).toEqual(initialState);
  });
});
