import React, { Component } from 'react';
import { Grid, Button, Typography, IconButton, Icon } from '@material-ui/core';
import PeerConnection from './PeerConnection';
import Peer from 'peerjs';
import UserInformation from '../UserInformation/UserInformation';

class VoiceChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      users: [],
      showConnectButton: 'visible',
      userConnectedToVoiceChat: false,
      myPeer: null,
      user: null
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    socket.on('get all peers users', data => {
      this.setState({ users: data });
    });
  }

  static getDerivedStateFromProps = props => ({
    socket: props.socket,
    user: props.user
  });

  disconnectUser = () => {
    const { myPeer, socket } = this.state;
    myPeer.on('close', () => {
      console.log('disconnected peer', myPeer.id);
      socket.emit('disconnect peer', myPeer.id);
      this.endConnection();
    });
    myPeer.destroy();
  };
  endConnection = () => {
    const { socket, myPeer } = this.state;
    socket.removeAllListeners(['get other peer id']);
    myPeer.off('disconnected');
    myPeer.off('open');
    myPeer.off('connection');
    myPeer.off('call');

    this.setState({
      userConnectedToVoiceChat: false,
      showConnectButton: 'visible'
    });
  };

  connectToVoiceChat = async () => {
    const {
      socket,
      showConnectButton,
      userConnectedToVoiceChat,
      myPeer
    } = this.state;
    if (showConnectButton === 'hidden' || userConnectedToVoiceChat) return;
    await this.setState({
      showConnectButton: 'hidden'
    });
    try {
      myPeer.reconnect();
      socket.emit('add new peer', myPeer.id);
      this.setState({
        userConnectedToVoiceChat: true,
        myPeer
      });
    } catch (error) {
      const newPeer = new Peer({
        host: 'audio-chat-aps.herokuapp.com',
        path: '/peerjs',
        secure: true,
        // config: {
        //   iceServers: [
        //     { url: 'stun:stun1.l.google.com:19302' },
        //     {
        //       url: 'turn:numb.viagenie.ca',
        //       credential: 'guifss',
        //       username: 'guifss@live.com'
        //     },
        //     {
        //       url: 'turn:turn.bistri.com:80',
        //       credential: 'homeo',
        //       username: 'homeo'
        //     }
        //   ]
        // }
      });

      newPeer.on('open', id => {
        socket.emit('add new peer', id);
        console.log('my peer id:', id);
        this.setState({
          userConnectedToVoiceChat: true,
          myPeer: newPeer
        });
      });
    }
  };

  render() {
    const { socket, userConnectedToVoiceChat, myPeer, users } = this.state;
    return (
      <Grid
        style={{
          backgroundColor: '#2F3136',
          padding: '20px'
        }}
        xs={3}
        sm={2}
        item
      >
        {userConnectedToVoiceChat && (
          <div>
            {console.log('vai mostrar peer connection')}
            <PeerConnection myPeer={myPeer} socket={socket} />
          </div>
        )}

        <div style={{ marginTop: '60px' }}>
          <Typography id='voice-channel' onClick={this.connectToVoiceChat}>
            <svg
              style={{
                width: '20px',
                height: '20px',
                display: 'inline',
                marginRight: '3px',
                float: 'left'
              }}
              viewBox='0 0 24 24'
            >
              <path
                fill='#72767D'
                d='M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z'
              />
            </svg>
            Knéél de voix
          </Typography>
          {/* users in the voice channel */}
          <div style={{ marginLeft: '20px' }}>
            {users.map(({ user }) => (
              <div key={user.username} style={{ marginTop: '15px' }}>
                <UserInformation
                  avatarConfig={{ w: '25px', h: '25px', fs: '11pt' }}
                  avatarColor={user.avatarColor}
                  avatarLetters={`${user.username
                    .split('')
                    .filter((_, i) => i < 3)
                    .join('')}`}
                  body1={user.username}
                />
              </div>
            ))}
          </div>
        </div>
        {userConnectedToVoiceChat && (
          <div style={{ position: 'absolute', bottom: '15%' }}>
            <Button
              onClick={this.disconnectUser}
              style={{ backgroundColor: 'red' }}
              size='small'
            >
              Disconnect
            </Button>
          </div>
        )}
      </Grid>
    );
  }
}
export default VoiceChat;
