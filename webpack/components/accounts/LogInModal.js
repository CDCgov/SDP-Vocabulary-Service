import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';

export default class LogInModal extends Component {
  constructor(props) {
    super(props);
    this.state = {email: '', password: '', rememberMe: '0', invalidCredentials: false};
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closer}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div hidden={!this.state.invalidCredentials}>Invalid Credentials</div>
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

  attemptLogIn() {
    const successHandler = () => this.props.closer();
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
