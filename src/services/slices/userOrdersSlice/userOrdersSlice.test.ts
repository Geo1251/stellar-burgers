import reducer, { fetchUserOrdersThunk } from './userOrdersSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    number: 1,
    status: 'done',
    name: 'User Order 1',
    createdAt: '',
    updatedAt: '',
    ingredients: []
  },
  {
    _id: '2',
    number: 2,
    status: 'created',
    name: 'User Order 2',
    createdAt: '',
    updatedAt: '',
    ingredients: []
  }
];

describe('UserOrders Reducer', () => {
  const initialState = {
    orders: [],
    isLoading: false,
    error: null
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchUserOrdersThunk.pending', () => {
    const action = { type: fetchUserOrdersThunk.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUserOrdersThunk.fulfilled', () => {
    const action = {
      type: fetchUserOrdersThunk.fulfilled.type,
      payload: mockOrders
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
  });

  it('should handle fetchUserOrdersThunk.rejected', () => {
    const error = 'Failed to fetch user orders';
    const action = { type: fetchUserOrdersThunk.rejected.type, payload: error };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(error);
  });
});
