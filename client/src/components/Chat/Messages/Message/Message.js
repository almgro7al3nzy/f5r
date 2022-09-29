import React from 'react';
import { Typography, Divider } from '@material-ui/core';
import UserInformation from '../../../UserInformation/UserInformation';
//
const Message = ({
  children,
  previousUsrId,
  currentUsrId,
  username,
  date,
  avatarColor
}) => {
  let differentUser = true;
  if (previousUsrId && currentUsrId) {
    differentUser = previousUsrId !== currentUsrId;
  }
  return (
    <div style={{ padding: '10px' }}>
      {differentUser && (
        <Divider
          style={{ marginTop: '10px', marginBottom: '10px' }}
          variant='fullWidth'
        />
      )}

      {differentUser && (
        <UserInformation
          avatarLetters={username[0] + username[1] + username[2]}
          body1={username}
          date={date}
          avatarColor={avatarColor}
        />
      )}
      <Typography
        variant='body2'
        style={{
          marginBottom: '-20px',
          marginLeft: '50px',
          wordBreak: 'break-word'
        }}
      >
        {children}{' '}
      </Typography>
    </div>
  );
};

export default Message;
