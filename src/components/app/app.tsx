import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { ProtectedRouteElement } from '../protected-route/protected-route';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { fetchUserThunk } from '../../services/slices/userSlice';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUserThunk());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRouteElement element={<OrderInfo />} />}
        />

        <Route
          path='/login'
          element={<ProtectedRouteElement onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRouteElement onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRouteElement onlyUnAuth element={<ForgotPassword />} />
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRouteElement onlyUnAuth element={<ResetPassword />} />
          }
        />

        <Route
          path='/profile'
          element={<ProtectedRouteElement element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRouteElement element={<ProfileOrders />} />}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRouteElement
                element={
                  <Modal title='Информация о заказе' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
