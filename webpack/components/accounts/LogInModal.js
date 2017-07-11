import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

export default class LogInModal extends Component {
  constructor(props) {
    super(props);
    this.state = {email: '', password: '', rememberMe: '0', invalidCredentials: false};
  }

  render() {
    return (
      <Modal animation={false} show={this.props.show} onHide={this.props.closer} aria-label="Sign In">
        <Modal.Header closeButton>
          <Modal.Title componentClass="h1">Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="alert alert-danger" hidden={!this.state.invalidCredentials}><strong>Invalid Credentials!</strong> Please check the information you entered and try again.</div>
            <div>
              <label className="control-label" htmlFor="email">Email</label>
              <input autoFocus="autofocus" className="form-control input-lg" type="email" value={this.state.email} name="email" id="email" onChange={this.handleChange('email')}/>
            </div>
            <div>
              <label className="control-label" htmlFor="password">Password</label>
              <input autoComplete="off" className="form-control input-lg" type="password" name="user_password" value={this.state.password} id="password" onChange={this.handleChange('password')}/>
            </div>

            <div>
              <input type="checkbox" value={this.state.rememberMe} name="rememberMe" id="rememberMe" onChange={this.handleChange('rememberMe')}/>
              <label htmlFor="rememberMe">Remember me</label>
            </div>

            <div>
              <a href="/users/auth/openid_connect">Sign in with OpenID Connect</a>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.props.closer}>Close</button>
          <button type="button" className="btn btn-primary" onClick={() => this.attemptLogIn() }>Log In</button>
        </Modal.Footer>
      </Modal>
    );
  }

  logInSuccess() {
    this.props.closer();
    window.location.reload();
  }

  attemptLogIn() {
    const successHandler = () => this.logInSuccess();
    const failureHandler = () => this.setState({invalidCredentials: true});
    this.props.logIn(this.state, successHandler, failureHandler);
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    };
  }
}

LogInModal.propTypes = {
  logIn: PropTypes.func.isRequired,
  closer: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
