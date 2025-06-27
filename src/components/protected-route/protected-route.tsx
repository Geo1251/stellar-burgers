import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FC, ReactElement } from 'react';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRouteElement: FC<ProtectedRouteProps> = ({
  element,
  onlyUnAuth = false
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
