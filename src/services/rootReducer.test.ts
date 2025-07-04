import rootReducer, { RootState } from './rootReducer';
import { UnknownAction } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const initialState: RootState = {
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        isLoadingCurrentOrder: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      userOrders: {
        orders: [],
        isLoading: false,
        error: null
      }
    };

    const action: UnknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);
    expect(state).toEqual(initialState);
  });
});
