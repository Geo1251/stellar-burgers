import { useSelector } from '../../services/store';
import styles from './constructor-page.module.css';
import { BurgerIngredients } from '../../components/burger-ingredients';
import { BurgerConstructor } from '../../components/burger-constructor';
import { Preloader } from '../../components/ui/preloader';
import { FC } from 'react';
import { selectIngredientsLoading } from '../../services/slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
