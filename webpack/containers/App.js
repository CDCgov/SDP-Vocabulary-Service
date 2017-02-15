import React, { Component, PropTypes } from 'react';
import Header from './Header';
import LogInModal from '../components/accounts/LogInModal';
import { connect } from 'react-redux';

import { fetchCurrentUser, logIn } from '../actions/current_user_actions';
import currentUserProps from '../prop-types/current_user_props';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logInOpen: false};
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

  render() {
    return (
      <div>
        <Header currentUser={this.props.currentUser} modalOpener={() => this.openLogInModal()}/>
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
      </div>
    );
  }
}

App.propTypes = {
  currentUser: currentUserProps,
  fetchCurrentUser: PropTypes.func,
  logIn: PropTypes.func,
  children: PropTypes.object
};

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, {fetchCurrentUser, logIn})(App);
