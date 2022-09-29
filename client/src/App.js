import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import Login from './components/Login/Login';
import axios from 'axios';
import Chat from './components/Chat/Chat';
import withRoot from './Layout/withRoot';
import * as muiColors from '@material-ui/core/colors/';

let socketUrl = 'http://localhost:5000';
socketUrl = '';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(socketUrl),
      isAuthenticate: false,
      user: {}
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    socket.on('login', data => {
      this.setState({
        user: data,
        isAuthenticate: true
      });
    });
    socket.on('message', data => {
      if (data.loginError) {
        alert(data.loginError);
      }
      console.log('message:', data);
    });
  }

  getRandomMUIColor = () => {
    const keys = Object.keys(muiColors);
    const rnd = Math.floor(Math.random() * (keys.length - 1));
    return muiColors[keys[rnd]][500];
  };

  login = async (loginOrCadastrar, user) => {
    const { socket } = this.state;
    if (loginOrCadastrar === 'login') {
      try {
        socket.emit('login', user);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axios.post(`${socketUrl}/api/user/cadastrar`, user);
        console.log(res.data.msg);
        socket.emit('new user', res.data.newUser);
      } catch (err) {
        console.log(err);
      }
    }
  };

  onUserOnClick = () => {
    // const newUser = { ...this.state.user };
    // newUser.avatarColor = this.getRandomMUIColor();
    // this.setState({ user: newUser });
  };

  render() {
    const { socket, isAuthenticate, user } = this.state;

    return (
      <div className='div-full'>
        {isAuthenticate ? (
          <Fragment>
            <Chat
              onUserOnClick={this.onUserOnClick}
              socket={socket}
              user={user}
            />
          </Fragment>
        ) : (
          <Login login={this.login} />
        )}
      </div>
    );
  }
}

export default withRoot(App);
