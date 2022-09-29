import React, { useState } from 'react';
import { TextField, Grid } from '@material-ui/core';

// TODO: create events when user is typing, create the message when someone press ENTER
const TextArea = ({ sendMessage, socket, username }) => {
  const [txtValue, setTxtValue] = useState('');
  const handleEnterPressed = () => {
    const trimValue = txtValue.trim();
    if (trimValue.legth === 0 || trimValue === '') return;
    setTimeout(() => {
      setTxtValue('');
      socket.emit('stop typing', username);
    }, 1);
    sendMessage(txtValue);
  };

  const handleChange = value => {
    socket.emit('typing', username);
    setTxtValue(value);
  };
  return (
    <Grid
      style={{ marginTop: '-5px' }}
      container
      direction='row'
      justify='flex-start'
      alignItems='flex-start'
    >
      <Grid xs={3} sm={2} item />
      <Grid xs={6} sm={8} item>
        <TextField
          autoFocus
          style={{
            // position: 'fixed',
            // width: '67% ',
            bottom: '5px',
            backgroundColor: '#484C52'
          }}
          onChange={e => handleChange(e.target.value)}
          onKeyPress={e => (e.key === 'Enter' ? handleEnterPressed() : '')}
          value={txtValue}
          placeholder='Message #knéél-generél'
          multiline
          fullWidth
          rows='2'
          margin='normal'
          variant='outlined'
        />
      </Grid>
    </Grid>
  );
};

export default TextArea;
