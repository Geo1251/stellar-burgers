import { FC, memo, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIngredients,
  fetchIngredients
} from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { Preloader } from '@ui';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const ingredientsStore: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (ingredientsStore.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientsStore.length]);

  const orderInfo = useMemo(() => {
    if (!ingredientsStore.length || !order) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredientsStore.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredientsStore]);

  if (!orderInfo) return <Preloader />;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
