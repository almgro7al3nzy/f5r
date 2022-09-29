import React, { Component, Fragment } from 'react';
// import './Login.css';
import { Button, TextField, Typography, Grid } from '@material-ui/core';

class Login extends Component {
  state = {
    username: '',
    password: '',
    btnText: 'LOGIN',
    confirmPassword: '',
    showConfirmPassField: false,
    confirmPassError: false,
    smallText: 'ou cadastre-se',
    avatarColor: '#7289DA'
  };

  handleInputChange = (name, value) => {
    const {
      showConfirmPassField,
      confirmPassError,
      password,
      confirmPassword
    } = this.state;
    let showError = confirmPassError;
    if (showConfirmPassField) {
      if (name === 'confirmPassword') {
        if (value !== password) {
          showError = true;
        } else {
          showError = false;
        }
      } else if (name === 'password') {
        if (value !== confirmPassword) {
          showError = true;
        } else {
          showError = false;
        }
      }
    }
    this.setState({ [name]: value, confirmPassError: showError });
  };

  onClickSmallBtn = () => {
    if (this.state.showConfirmPassField) {
      this.setFormType('login');
    } else {
      this.setFormType('cadastro');
    }
  };

  /**
   * params: type = 'login' || 'cadastro'
   */
  setFormType = type => {
    let showConfirmPassField, btnText, smallText;
    if (type === 'login') {
      showConfirmPassField = false;
      btnText = 'LOGIN';
      smallText = 'ou cadastre-se';
    } else {
      showConfirmPassField = true;
      btnText = 'CADASTRAR';
      smallText = 'faça login';
    }
    this.setState({ showConfirmPassField, btnText, smallText });
  };

  onClickMainBtn = () => {
    const { btnText, username, password, avatarColor } = this.state;

    if (username.length < 3 || password.length < 3) {
      window.alert('min 3 length plz!!');
      return;
    }

    if (btnText.toLowerCase() === 'cadastrar') {
      this.setFormType('login');
    }

    this.props.login(btnText.toLowerCase(), {
      username,
      password,
      avatarColor
    });
  };

  render() {
    const {
      username,
      password,
      btnText,
      confirmPassword,
      showConfirmPassField,
      confirmPassError,
      smallText,
      avatarColor
    } = this.state;

    let cadastroForm = null;
    if (showConfirmPassField) {
      cadastroForm = (
        <Fragment>
          <TextField
            error={confirmPassError}
            fullWidth
            variant='outlined'
            label='Confirm Password'
            required
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={confirmPassword}
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
            onKeyPress={e => (e.key === 'Enter' ? this.onClickMainBtn() : '')}
          />
          <br />
          <br />
          <label htmlFor='avatarColor'>
            <Typography inline={true} variant='body1'>
              escolha uma cor para o seu avatar
            </Typography>
          </label>{' '}
          <input
            required
            type='color'
            id='avatarColor'
            name='avatarColor'
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
            value={avatarColor}
          />
          <Typography variant='caption'>
            Obs: pode ser alterada depois (talvez :p)
          </Typography>
          <br />
        </Fragment>
      );
    }

    return (
      <Grid
        direction='row'
        justify='center'
        alignItems='flex-end'
        container
        style={{ height: window.innerHeight }}
      >
        <Grid
          xs={8}
          md={6}
          lg={4}
          style={{ alignSelf: 'center' }}
          id='login-div'
          item
        >
          <TextField
            fullWidth
            variant='outlined'
            label='Username'
            placeholder='min length: 3'
            required
            autoFocus
            id='username'
            name='username'
            value={username}
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
          />
          <br />
          <br />
          <TextField
            fullWidth
            variant='outlined'
            label='Password'
            placeholder='min length: 3'
            required
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={e =>
              this.handleInputChange(e.target.name, e.target.value)
            }
            onKeyPress={e => (e.key === 'Enter' ? this.onClickMainBtn() : '')}
          />
          <br />
          <br />

          {cadastroForm}

          <Button
            disabled={btnText.toLowerCase() === 'cadastrar' && confirmPassError}
            fullWidth
            variant='contained'
            color='primary'
            onClick={this.onClickMainBtn}
          >
            {btnText}
          </Button>

          <Button
            onClick={this.onClickSmallBtn}
            style={{ float: 'right', marginTop: '5px' }}
            color='default'
            variant='text'
            size='small'
          >
            <small>{smallText}</small>
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Login;
