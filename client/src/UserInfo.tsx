import './UserInfo.css';

import React from 'react';

import {User} from './api';

interface UserInfoProps {
  user: User;
}
const UserInfo = ({user}: UserInfoProps) => (
  <div className='email'>{user.email}</div>
);

export default UserInfo;
