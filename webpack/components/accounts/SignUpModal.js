import React from 'react';
import PropTypes from 'prop-types';

import ProfileEditor from './ProfileEditor';

export default class SignUpModal extends ProfileEditor {
  constructor(props) {
    super(props);
    this.state = {email: '', firstName: '', lastName: '', password: '', passwordConfirmation: '', groups: [],
      lastProgramId: -1, lastSystemId: -1, defaultProgramId: -1, defaultSystemId: -1, errors: {}};
  }

  title() {
    return "Sign Up";
  }

  actionButton() {
    return <button type="button" className="btn btn-primary" onClick={() => this.attemptSignUp() }>Sign Up</button>;
  }

  extraContent() {
    return (<div>
      <div className="control-group">
        <label className="control-label" htmlFor="password">Password</label>
        <div className="controls">
          <input autoComplete="off" placeholder="" className="form-control input-lg" type="password" name="password" id="password" onChange={this.handleChange('password')}/>
          <p className="help-block">Password should be at least
            6
            characters</p>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label" htmlFor="passwordConfirmation">Password (Confirm)</label>
        <div className="controls">
          <input autoComplete="off" placeholder="" className="form-control input-lg" type="password"
                 name="passwordConfirmation" id="passwordConfirmation" onChange={this.handleChange('passwordConfirmation')}/>
          <p className="help-block">Please confirm password</p>
        </div>
      </div>
    </div>);
  }

  attemptSignUp() {
    const successHandler = () => this.props.closer();
    const failureHandler = (failureResponse) => this.setState({errors: failureResponse.response.data.errors});
    this.props.signUp(this.profileInformation(), successHandler, failureHandler);
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    };
  }
}

SignUpModal.propTypes = {
  signUp: PropTypes.func.isRequired
};
