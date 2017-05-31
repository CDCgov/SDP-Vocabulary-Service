import React, { PropTypes } from 'react';

import ProfileEditor from './ProfileEditor';

import currentUserProps from '../../prop-types/current_user_props';

export default class SettingsModal extends ProfileEditor {
  constructor(props) {
    super(props);
    this.state = {email: this.props.currentUser.email,
      id: this.props.currentUser.id,
      firstName: this.props.currentUser.firstName || '',
      lastName:  this.props.currentUser.lastName  || '',
      lastProgramId: this.props.currentUser.lastProgramId || -1,
      lastSystemId:  this.props.currentUser.lastSystemId  || -1,
      defaultProgramId: this.props.currentUser.lastProgramId || -1,
      defaultSystemId:  this.props.currentUser.lastSystemId  || -1,
      errors: {} };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if (nextProps.currentUser) {
      this.setState({email: nextProps.currentUser.email,
        id: nextProps.currentUser.id,
        firstName: nextProps.currentUser.firstName || '',
        lastName: nextProps.currentUser.lastName || '',
        lastProgramId: this.props.currentUser.lastProgramId || -1,
        lastSystemId: this.props.currentUser.lastSystemId || -1
      });
    }
  }

  title() {
    return "Account Details";
  }

  actionButton() {
    return <button type="button" className="btn btn-primary" onClick={() => this.attemptUpdate() }>Update</button>;
  }

  extraContent() {
    return ''; // None needed
  }

  attemptUpdate() {
    const successHandler = () => this.props.closer();
    const failureHandler = (failureResponse) => this.setState({errors: failureResponse.response.data.errors});
    this.props.update(this.profileInformation(), successHandler, failureHandler);
  }
}

SettingsModal.propTypes = {
  currentUser: currentUserProps,
  update: PropTypes.func.isRequired
};
