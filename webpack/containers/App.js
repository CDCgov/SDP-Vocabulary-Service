import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import { fetchCurrentUser } from '../actions/current_user_actions';

class App extends Component {
  componentWillMount() {
    this.props.fetchCurrentUser();
  }

  render() {
    return (
      <div>
        <div>Header Stuff</div>
        {this.props.children}
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
      </div>
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object,
  fetchCurrentUser: PropTypes.func,
  children: PropTypes.object
};

function mapStateToProps(state) {
  return {currentUser: state.currentUser};
}

export default connect(mapStateToProps, {fetchCurrentUser})(App);
