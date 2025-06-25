import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface BurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientToConstructor: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = { ...action.payload, id: uuidv4() };
      } else {
        state.ingredients.push({ ...action.payload, id: uuidv4() });
      }
    },
    removeIngredientFromConstructor: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    moveIngredientInConstructor: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = [...state.ingredients];
      const [movedItem] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedItem);
      state.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredientToConstructor,
  removeIngredientFromConstructor,

  moveIngredientInConstructor,
  clearConstructor
} = burgerConstructorSlice.actions;

export const selectConstructorItems = (state: {
  burgerConstructor: BurgerConstructorState;
}) => state.burgerConstructor;

export default burgerConstructorSlice.reducer;
