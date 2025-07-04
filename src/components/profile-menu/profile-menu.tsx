import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUserThunk } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUserThunk())
      .unwrap()
      .then(() => navigate('/login'))
      .catch((err) => console.error('Logout failed:', err));
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
