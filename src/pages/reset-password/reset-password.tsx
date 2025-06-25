import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  resetPasswordThunk,
  selectUserIsLoading,
  selectUserError,
  clearUserErrorState
} from '../../services/slices/userSlice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useDispatch();
  const isLoading = useSelector(selectUserIsLoading);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearUserErrorState());
    dispatch(resetPasswordThunk({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => {
        console.error('Reset password error:', err);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error || undefined}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
