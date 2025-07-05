import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../../utils/burger-api';
import { createSelector } from 'reselect';
import { TOrder } from '@utils-types';
import type { TFeedsResponse } from '../../../utils/burger-api';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeedsThunk = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('feed/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred while fetching feeds');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(
        fetchFeedsThunk.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.isLoading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeedsThunk.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload ?? 'Failed to fetch feeds';
      });
  }
});

export const selectFeedOrders = (state: { feed: FeedState }) =>
  state.feed.orders;
export const selectFeedData = createSelector(
  (state: { feed: FeedState }) => state.feed.total,
  (state: { feed: FeedState }) => state.feed.totalToday,
  (total, totalToday) => ({ total, totalToday })
);

export const selectFeedIsLoading = (state: { feed: FeedState }) =>
  state.feed.isLoading;
export const selectFeedError = (state: { feed: FeedState }) => state.feed.error;

export default feedSlice.reducer;
