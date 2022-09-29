import React, { Component } from 'react';
import UsersOnOff from './UsersOnOff/UsersOnOff';
import { Grid } from '@material-ui/core';
import Messages from './Messages/Messages';
import TextArea from './TextArea/TextArea';
import VoiceChat from '../VoiceChat/VoiceChat';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      onlineUsers: [],
      peers: [],
      usersOfTheRoom: [],
      messages: [],
      socket: null
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    socket.on('get online users', data => {
      this.setState({ onlineUsers: data });
    });
    socket.on('get users of the room', data => {
      this.setState({ usersOfTheRoom: data });
    });
  }

  static getDerivedStateFromProps = props => ({
    socket: props.socket,
    user: props.user
  });

  sendMessage = value => {
    const { user, socket } = this.state;
    const message = { user: user._id, body: value };
    socket.emit('new message', message);
  };

  render() {
    const { usersOfTheRoom, onlineUsers, socket, user } = this.state;
    const avatarColor = user.avatarColor;

    return (
      <Grid
        className='div-full'
        container
        direction='row'
        justify='space-between'
        alignItems='stretch'
        spacing={8}
      >
        <VoiceChat socket={socket} user={user} />
        <Messages avatarColor={avatarColor} socket={socket} />
        <UsersOnOff
          onUserOnClick={this.props.onUserOnClick}
          avatarColor={avatarColor}
          usersOfTheRoom={usersOfTheRoom}
          onlineUsers={onlineUsers}
          socket={socket}
        />
        <TextArea
          socket={socket}
          username={user.username}
          sendMessage={this.sendMessage}
        />
      </Grid>
    );
  }
}

export default Chat;
