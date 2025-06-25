import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIngredients,
  fetchIngredients
} from '../../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = ingredients.find(
    (ingredient: TIngredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
