import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `text text_type_main-default mr-10 ${styles.link} ${isActive ? styles.link_active : ''}`
          }
          end
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2'>Конструктор</span>
            </>
          )}
        </NavLink>
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `text text_type_main-default ${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='ml-2'>Лента заказов</span>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>
      <NavLink
        to='/profile'
        className={({ isActive }) =>
          `text text_type_main-default ${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`
        }
        data-cy='profile-link'
      >
        {({ isActive }) => (
          <>
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
            <span className='ml-2'>{userName || 'Личный кабинет'}</span>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
