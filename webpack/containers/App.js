import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { fetchAdmins } from '../actions/admin_actions';
import { fetchStats } from '../actions/landing';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logInOpen: false, signUpOpen: false, settingsOpen: false};
    this.updateUser        = this.updateUser.bind(this);
    this.openLogInModal    = this.openLogInModal.bind(this);
    this.openSignUpModal   = this.openSignUpModal.bind(this);
    this.closeLogInModal   = this.closeLogInModal.bind(this);
    this.closeSignUpModal  = this.closeSignUpModal.bind(this);
    this.openSettingsModal = this.openSettingsModal.bind(this);
    this.closeSettingsModal= this.closeSettingsModal.bind(this);
  }

  componentWillMount() {
    this.props.fetchCurrentUser();
    this.props.fetchSurveillancePrograms();
    this.props.fetchSurveillanceSystems();
    this.props.fetchPublishers();
    this.props.fetchAdmins();
    this.props.fetchStats();
  }

  disableUserRegistration() {
    const metas = document.getElementsByTagName('meta');
    let dur = true;
    for (let i = 0; i < metas.length; i++) {
      const meta = metas[i];
      if (meta.getAttribute('name') === 'DISABLE_LOGIN_UI') {
        dur =  meta.getAttribute('content') == 'true';
      }
    }

    return dur;
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

  updateUser(user, successHandler=null, failureHandler=null){
    this.props.updateUser(user, ()=>{
      this.props.fetchCurrentUser();
      successHandler();
    }, failureHandler);
  }

  render() {
    return (
      <div>
        <text className="sr-only">Welcome to the vocabulary service. Click the next link to skip navigation and go to main content.</text>
        <a href="#main-content" id="skip-nav" className="sr-only sr-only-focusable" tabIndex="1" onClick={() => {
          var element = document.getElementById('main-content');
          element.tabIndex = -1;
          element.focus();
        }}>Skip to main content</a>
        <Header currentUser={this.props.currentUser}
                disableUserRegistration={this.disableUserRegistration()}
                location={this.props.location}
                logInOpener={this.openLogInModal}
                signUpOpener={this.openSignUpModal}
                settingsOpener={this.openSettingsModal}
                appVersion={this.props.appVersion} />
        <div className='main-content' id="main-content">
          {this.props.children}
        </div>
        <footer className="footer">
          <div className="container">
            2018 Centers for Disease Control and Prevention. All rights reserved.
            <div className="nav-links">
              <a target="_blank" href="https://www.cdc.gov/sdp/SDPContactUs.html">Contact Us</a>
              <Link to="/termsOfService">Terms of Service</Link>
              Release: v{this.props.appVersion}
            </div>
          </div>
        </footer>
        <LogInModal logIn={this.props.logIn} show={this.state.logInOpen} closer={this.closeLogInModal}/>
        <SignUpModal signUp={this.props.signUp} show={this.state.signUpOpen}
          closer={this.closeSignUpModal}
          surveillanceSystems={this.props.surveillanceSystems}
          surveillancePrograms={this.props.surveillancePrograms} />
        <SettingsModal update={this.updateUser}
          disableUserUpdate={this.disableUserRegistration()}
          show={this.state.settingsOpen}
          closer={this.closeSettingsModal}
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
  appVersion: PropTypes.string,
  signUp: PropTypes.func,
  updateUser: PropTypes.func,
  fetchSurveillanceSystems: PropTypes.func,
  fetchSurveillancePrograms: PropTypes.func,
  fetchPublishers: PropTypes.func,
  fetchAdmins: PropTypes.func,
  fetchStats: PropTypes.func,
  children: PropTypes.object,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    surveillanceSystems: state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    appVersion: state.stats.version,
    errors: state.errors
  };
}

export default connect(mapStateToProps, {fetchCurrentUser, logIn, signUp, updateUser,
  fetchSurveillanceSystems, fetchSurveillancePrograms, fetchPublishers, fetchAdmins, fetchStats})(App);
