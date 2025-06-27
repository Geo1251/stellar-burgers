import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { clearConstructor } from './burgerConstructorSlice';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  isLoadingCurrentOrder: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  isLoadingCurrentOrder: false,
  error: null
};

export const createOrderThunk = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { dispatch, rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientIds);
    dispatch(clearConstructor());
    return response.order;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(
      'An unknown error occurred while creating the order'
    );
  }
});

export const fetchOrderByNumberThunk = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    if (response.orders && response.orders.length > 0) {
      return response.orders[0];
    }

    return rejectWithValue(`Order number ${orderNumber} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(
      `An unknown error occurred while fetching order ${orderNumber}`
    );
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalDataState: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrderState: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
        state.orderModalData = null;
      })
      .addCase(
        createOrderThunk.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;

          state.orderModalData = action.payload;
        }
      )
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? 'Failed to create order';
      })
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.isLoadingCurrentOrder = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(
        fetchOrderByNumberThunk.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoadingCurrentOrder = false;
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.isLoadingCurrentOrder = false;
        state.error = action.payload ?? 'Failed to fetch order';
      });
  }
});

export const { clearOrderModalDataState, clearCurrentOrderState } =
  orderSlice.actions;

export const selectOrderRequest = (state: { order: OrderState }) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: { order: OrderState }) =>
  state.order.orderModalData;
export const selectCurrentOrder = (state: { order: OrderState }) =>
  state.order.currentOrder;
export const selectIsLoadingCurrentOrder = (state: { order: OrderState }) =>
  state.order.isLoadingCurrentOrder;
export const selectOrderError = (state: { order: OrderState }) =>
  state.order.error;

export default orderSlice.reducer;
