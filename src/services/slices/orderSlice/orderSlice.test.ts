import reducer, {
  createOrderThunk,
  fetchOrderByNumberThunk,
  clearOrderModalDataState,
  clearCurrentOrderState
} from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  number: 123,
  status: 'done',
  name: 'Test Order',
  createdAt: '',
  updatedAt: '',
  ingredients: ['1', '2']
};

describe('Order Reducer', () => {
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    currentOrder: null,
    isLoadingCurrentOrder: false,
    error: null
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearOrderModalDataState', () => {
    const stateWithData = { ...initialState, orderModalData: mockOrder };
    const newState = reducer(stateWithData, clearOrderModalDataState());
    expect(newState.orderModalData).toBeNull();
  });

  it('should handle clearCurrentOrderState', () => {
    const stateWithData = { ...initialState, currentOrder: mockOrder };
    const newState = reducer(stateWithData, clearCurrentOrderState());
    expect(newState.currentOrder).toBeNull();
  });

  it('should handle createOrderThunk.pending', () => {
    const action = { type: createOrderThunk.pending.type };
    const state = reducer(initialState, action);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createOrderThunk.fulfilled', () => {
    const action = {
      type: createOrderThunk.fulfilled.type,
      payload: mockOrder
    };
    const state = reducer({ ...initialState, orderRequest: true }, action);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
  });

  it('should handle createOrderThunk.rejected', () => {
    const error = 'Failed to create order';
    const action = { type: createOrderThunk.rejected.type, payload: error };
    const state = reducer({ ...initialState, orderRequest: true }, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toEqual(error);
  });

  it('should handle fetchOrderByNumberThunk.pending', () => {
    const action = { type: fetchOrderByNumberThunk.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoadingCurrentOrder).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchOrderByNumberThunk.fulfilled', () => {
    const action = {
      type: fetchOrderByNumberThunk.fulfilled.type,
      payload: mockOrder
    };
    const state = reducer(
      { ...initialState, isLoadingCurrentOrder: true },
      action
    );
    expect(state.isLoadingCurrentOrder).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
  });

  it('should handle fetchOrderByNumberThunk.rejected', () => {
    const error = 'Failed to fetch order by number';
    const action = {
      type: fetchOrderByNumberThunk.rejected.type,
      payload: error
    };
    const state = reducer(
      { ...initialState, isLoadingCurrentOrder: true },
      action
    );
    expect(state.isLoadingCurrentOrder).toBe(false);
    expect(state.error).toEqual(error);
  });
});
