import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface UserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('userOrders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getOrdersApi();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(
      'An unknown error occurred while fetching user orders'
    );
  }
});

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch user orders';
      });
  }
});

export const selectUserOrders = (state: { userOrders: UserOrdersState }) =>
  state.userOrders.orders;
export const selectUserOrdersLoading = (state: {
  userOrders: UserOrdersState;
}) => state.userOrders.isLoading;
export const selectUserOrdersError = (state: { userOrders: UserOrdersState }) =>
  state.userOrders.error;

export default userOrdersSlice.reducer;
