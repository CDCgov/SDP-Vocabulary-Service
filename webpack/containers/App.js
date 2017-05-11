import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Header from './Header';
import LogInModal from '../components/accounts/LogInModal';
import SignUpModal from '../components/accounts/SignUpModal';
import SettingsModal from '../components/accounts/SettingsModal';

import currentUserProps from '../prop-types/current_user_props';
import { surveillanceSystemsProps }from '../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../prop-types/surveillance_program_props';

import { fetchCurrentUser, logIn, signUp, updateUser } from '../actions/current_user_actions';
import { fetchSurveillanceSystems } from '../actions/surveillance_system_actions';
import { fetchSurveillancePrograms } from '../actions/surveillance_program_actions';
import { fetchPublishers } from '../actions/publisher_actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logInOpen: false, signUpOpen: false, settingsOpen: false};
  }

  componentWillMount() {
    this.props.fetchCurrentUser();
    this.props.fetchSurveillancePrograms();
    this.props.fetchSurveillanceSystems();
    this.props.fetchPublishers();
  }

  openLogInModal() {
    this.setState({logInOpen: true});
  }

  closeLogInModal() {
    this.setState({logInOpen: false});
  }

  openSignUpModal() {
    this.setState({signUpOpen: true});
  }

  closeSignUpModal() {
    this.setState({signUpOpen: false});
  }

  openSettingsModal() {
    this.setState({settingsOpen: true});
  }

  closeSettingsModal() {
    this.setState({settingsOpen: false});
  }

  render() {
    return (
      <div>
        <a href="#main-content" className="sr-only sr-only-focusable" tabIndex="1">Skip to main content</a>
        <Header currentUser={this.props.currentUser}
                location={this.props.location}
                logInOpener={() => this.openLogInModal()}
                signUpOpener={() => this.openSignUpModal()}
                settingsOpener={() => this.openSettingsModal()}/>
        <div className='main-content' id="main-content">
          {this.props.children}
        </div>
        <footer className="footer">
          <div className="container">
            2016 Centers for Disease Control and Prevention. All rights reserved.
            <div className="nav-links">
              <Link to="/privacy">Privacy</Link>
              <span href="#">Security</span>
              <span href="#">Terms of Service</span>
            </div>
          </div>
        </footer>
        <LogInModal logIn={this.props.logIn} show={this.state.logInOpen} closer={() => this.closeLogInModal()}/>
        <SignUpModal signUp={this.props.signUp} show={this.state.signUpOpen}
          closer={() => this.closeSignUpModal()}
          surveillanceSystems={this.props.surveillanceSystems}
          surveillancePrograms={this.props.surveillancePrograms} />
        <SettingsModal update={this.props.updateUser}
          show={this.state.settingsOpen}
          closer={() => this.closeSettingsModal()}
          currentUser={this.props.currentUser}
          surveillanceSystems={this.props.surveillanceSystems}
          surveillancePrograms={this.props.surveillancePrograms} />
      </div>
    );
  }
}

App.propTypes = {
  currentUser: currentUserProps,
  fetchCurrentUser: PropTypes.func,
  logIn: PropTypes.func,
  location: PropTypes.object,
  signUp: PropTypes.func,
  updateUser: PropTypes.func,
  fetchSurveillanceSystems: PropTypes.func,
  fetchSurveillancePrograms: PropTypes.func,
  fetchPublishers: PropTypes.func,
  children: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    errors: state.errors
  };
}

export default connect(mapStateToProps, {fetchCurrentUser, logIn, signUp, updateUser,
  fetchSurveillanceSystems, fetchSurveillancePrograms, fetchPublishers})(App);
