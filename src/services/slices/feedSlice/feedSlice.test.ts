import reducer, { fetchFeedsThunk } from './feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    number: 1,
    status: 'done',
    name: 'Order 1',
    createdAt: '',
    updatedAt: '',
    ingredients: []
  },
  {
    _id: '2',
    number: 2,
    status: 'pending',
    name: 'Order 2',
    createdAt: '',
    updatedAt: '',
    ingredients: []
  }
];

describe('Feed Reducer', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchFeedsThunk.pending', () => {
    const action = { type: fetchFeedsThunk.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchFeedsThunk.fulfilled', () => {
    const payload = { orders: mockOrders, total: 100, totalToday: 10 };
    const action = { type: fetchFeedsThunk.fulfilled.type, payload };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  it('should handle fetchFeedsThunk.rejected', () => {
    const error = 'Failed to fetch';
    const action = { type: fetchFeedsThunk.rejected.type, payload: error };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(error);
  });
});
