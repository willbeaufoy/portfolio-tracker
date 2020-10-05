import React from 'react';

import './UserInfo.css';

interface UserInfoProps {
  attrs: {email: string};
}
const UserInfo = (props: UserInfoProps) => (
  <div className="email">{props.attrs.email}</div>
);

export default UserInfo;
