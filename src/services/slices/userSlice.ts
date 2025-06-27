import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const handleAsyncError = (error: any, rejectWithValue: Function) => {
  if (error?.response?.data?.message) {
    return rejectWithValue(error.response.data.message);
  }
  if (error?.message) {
    return rejectWithValue(error.message);
  }
  return rejectWithValue('An unknown error occurred');
};

export const registerUserThunk = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const loginUserThunk = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/loginUser', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const fetchUserThunk = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/fetchUser', async (_, { dispatch, rejectWithValue }) => {
  if (!getCookie('accessToken')) {
    dispatch(setAuthCheckedState(true));
    return rejectWithValue('No access token');
  }
  try {
    const res = await getUserApi();
    return res.user;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  } finally {
    dispatch(setAuthCheckedState(true));
  }
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (data, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(data);
    return res.user;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const forgotPasswordThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('user/forgotPassword', async (data, { rejectWithValue }) => {
  try {
    await forgotPasswordApi(data);
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const resetPasswordThunk = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    await resetPasswordApi(data);
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthCheckedState: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearUserErrorState: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Registration failed';
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed';
      })

      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Logout failed';
      })

      .addCase(fetchUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Update user failed';
      })

      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Forgot password request failed';
      })

      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Reset password failed';
      });
  }
});

export const { setAuthCheckedState, clearUserErrorState } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuthChecked = (state: { user: UserState }) =>
  state.user.isAuthChecked;
export const selectUserIsLoading = (state: { user: UserState }) =>
  state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
