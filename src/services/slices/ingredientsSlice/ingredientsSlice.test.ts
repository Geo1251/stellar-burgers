import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Ingredient 1',
    type: 'bun',
    price: 100,
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    image: '',
    image_large: '',
    image_mobile: ''
  },
  {
    _id: '2',
    name: 'Ingredient 2',
    type: 'main',
    price: 200,
    proteins: 2,
    fat: 2,
    carbohydrates: 2,
    calories: 2,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('Ingredients Reducer', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('should handle fetchIngredients.rejected', () => {
    const error = 'Failed to fetch ingredients';
    const action = { type: fetchIngredients.rejected.type, payload: error };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(error);
  });
});
