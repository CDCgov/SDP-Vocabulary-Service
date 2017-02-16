import React, { Component, PropTypes } from 'react';
import Header from './Header';
import LogInModal from '../components/accounts/LogInModal';
import SignUpModal from '../components/accounts/SignUpModal';
import { connect } from 'react-redux';

import { fetchCurrentUser, logIn, signUp } from '../actions/current_user_actions';
import currentUserProps from '../prop-types/current_user_props';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logInOpen: false, signUpOpen: false};
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

  render() {
    return (
      <div>
        <Header currentUser={this.props.currentUser}
                logInOpener={() => this.openLogInModal()}
                signUpOpener={() => this.openSignUpModal()}/>
        <div className='main-content'>
          {this.props.children}
        </div>
        <footer className="footer">
          <div className="container">
            2016 Centers for Disease Control and Prevention. All rights reserved.
            <div className="nav-links">
              <span href="#">Privacy</span>
              <span href="#">Security</span>
              <span href="#">Terms of Service</span>
            </div>
          </div>
        </footer>
        <LogInModal logIn={this.props.logIn} show={this.state.logInOpen} closer={() => this.closeLogInModal()}/>
        <SignUpModal signUp={this.props.signUp} show={this.state.signUpOpen} closer={() => this.closeSignUpModal()}/>
      </div>
    );
  }
}

App.propTypes = {
  currentUser: currentUserProps,
  fetchCurrentUser: PropTypes.func,
  logIn: PropTypes.func,
  signUp: PropTypes.func,
  children: PropTypes.object
};

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, {fetchCurrentUser, logIn, signUp})(App);
