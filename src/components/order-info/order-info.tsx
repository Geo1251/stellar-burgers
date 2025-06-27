import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumberThunk,
  selectCurrentOrder,
  selectIsLoadingCurrentOrder,
  clearCurrentOrderState
} from '../../services/slices/orderSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const orderData = useSelector(selectCurrentOrder);
  const isLoadingOrder = useSelector(selectIsLoadingCurrentOrder);
  const allIngredients = useSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumberThunk(parseInt(number, 10)));
    }
    if (allIngredients.length === 0) {
      dispatch(fetchIngredients());
    }
    return () => {
      dispatch(clearCurrentOrderState());
    };
  }, [dispatch, number, allIngredients.length]);

  const orderInfo = useMemo(() => {
    if (!orderData || !allIngredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = allIngredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, allIngredients]);

  if (isLoadingOrder || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
