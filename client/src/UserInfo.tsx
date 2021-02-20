import './UserInfo.css';

import React from 'react';

import {User} from './types';

interface UserInfoProps {
  user: User;
}

export const UserInfo = ({user}: UserInfoProps) => (
  <div className='email'>{user.email}</div>
);
