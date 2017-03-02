import React, { Component, PropTypes } from 'react';
import Header from './Header';
import LogInModal from '../components/accounts/LogInModal';
import SignUpModal from '../components/accounts/SignUpModal';
import SettingsModal from '../components/accounts/SettingsModal';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchCurrentUser, logIn, signUp, updateUser } from '../actions/current_user_actions';
import currentUserProps from '../prop-types/current_user_props';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logInOpen: false, signUpOpen: false, settingsOpen: false};
  }

  componentWillMount() {
    this.props.fetchCurrentUser();
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
        <Header currentUser={this.props.currentUser}
                logInOpener={() => this.openLogInModal()}
                signUpOpener={() => this.openSignUpModal()}
                settingsOpener={() => this.openSettingsModal()}/>
        <div className='main-content'>
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
        <SignUpModal signUp={this.props.signUp} show={this.state.signUpOpen} closer={() => this.closeSignUpModal()}/>
        <SettingsModal update={this.props.updateUser}
          show={this.state.settingsOpen}
          closer={() => this.closeSettingsModal()}
          currentUser={this.props.currentUser}/>
      </div>
    );
  }
}

App.propTypes = {
  currentUser: currentUserProps,
  fetchCurrentUser: PropTypes.func,
  logIn: PropTypes.func,
  signUp: PropTypes.func,
  updateUser: PropTypes.func,
  children: PropTypes.object
};

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, {fetchCurrentUser, logIn, signUp, updateUser})(App);
