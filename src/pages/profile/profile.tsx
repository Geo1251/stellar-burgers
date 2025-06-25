import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUser,
  updateUserThunk,
  selectUserError,
  clearUserErrorState,
  selectUserIsLoading
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError);
  const isLoading = useSelector(selectUserIsLoading);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearUserErrorState());
    const dataToUpdate: Partial<typeof formValue> = {};
    if (formValue.name !== user?.name) dataToUpdate.name = formValue.name;
    if (formValue.email !== user?.email) dataToUpdate.email = formValue.email;
    if (formValue.password) dataToUpdate.password = formValue.password;

    if (Object.keys(dataToUpdate).length > 0) {
      dispatch(updateUserThunk(dataToUpdate))
        .unwrap()
        .then(() => {
          setFormValue((prev) => ({ ...prev, password: '' }));
        })
        .catch((err) => console.error('Update user error:', err));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading && !user) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateUserError || undefined}
    />
  );
};
