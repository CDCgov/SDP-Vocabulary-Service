import React, { Component, PropTypes } from 'react';

export default class LogInModal extends Component {
  constructor(props) {
    super(props);
    this.state = {email: '', password: '', rememberMe: '0'};
  }

  render() {
    return (
      <div className="modal fade" id="logIn" tabIndex="-1" role="dialog"
           ref={(div) => this.logInDiv = div }>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Sign In</h4>
              </div>
            <div className="modal-body">
              <form>
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
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={() => this.attemptLogIn() }>Log In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  attemptLogIn() {
    this.props.logIn(this.state);
    this.logInDiv.hide();
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
  logIn: PropTypes.func.isRequired
};
