import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import userOrdersReducer from './slices/userOrdersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
