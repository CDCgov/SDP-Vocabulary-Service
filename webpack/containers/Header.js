import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import currentUserProps from '../prop-types/current_user_props';
import NotificationDropdown from '../containers/NotificationDropdown';
import NotificationMenu from '../components/NotificationMenu';
import { fetchNotifications } from '../actions/notification_actions';

let LoginMenu = ({disableUserRegistration, logInOpener, signUpOpener, currentUser}) => {
  let loggedIn = ! isEmpty(currentUser);
  if(!loggedIn) {
    if(disableUserRegistration) {
      return (
        <ul className="nav navbar-nav">
          <li className="log-in-link">
            <a tabIndex="2" href="/users/auth/openid_connect">Login</a>
          </li>
        </ul>
      );
    }
    return (
      <ul className="nav navbar-nav">
        <li className="log-in-link">
          <a href="#" tabIndex="2" onClick={() => {
            logInOpener();
            return false;
          }}>Login </a>
        </li>
        <li>
          <a href="#" tabIndex="2" onClick={() => {
            signUpOpener();
            return false;
          }}> Register </a>
        </li>
      </ul>
    );
  }
  return null;

};

LoginMenu.propTypes = {
  currentUser: currentUserProps,
  logInOpener: PropTypes.func.isRequired,
  signUpOpener: PropTypes.func.isRequired,
  disableUserRegistration: PropTypes.bool.isRequired
};

let ContentMenu = ({settingsOpener, currentUser}) => {
  let loggedIn = ! isEmpty(currentUser);
  if(loggedIn) {
    let {email} = currentUser;
    return(
      <li className="dropdown">
        <a href="#" tabIndex="2" id="account-dropdown" className="dropdown-toggle account-dropdown" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-cog utlt-navbar-icon" aria-hidden="true"></i>{email}<span className="caret"></span></a>
        <ul className="dropdown-menu">
          <li><a href="#" tabIndex="2" onClick={(e) => {
            e.preventDefault();
            settingsOpener();
            return false;
          }}>Settings</a></li>
          {currentUser.admin && <li><Link to="/admin" tabIndex="2"><text className="sr-only">Click link to visit </text>Admin Panel</Link></li>}
          <li role="separator" className="divider"></li>
          <li>
            <a href="/users/sign_out" tabIndex="2">Logout</a>
          </li>
        </ul>
      </li>
    );
  }
  return false;
};
ContentMenu.propTypes = {
  currentUser: currentUserProps,
  settingsOpener: PropTypes.func.isRequired
};


let SignedInMenu = ({currentUser, location, notifications, notificationCount}) => {
  let loggedIn = ! isEmpty(currentUser);
  if(loggedIn) {
    return (
      <ul className="cdc-nav cdc-utlt-navbar-nav">
        <li className="active"><a href="#" tabIndex="2" className="cdc-navbar-item"><i className="fa fa-bar-chart item-navbar-icon" aria-hidden="true"></i>Dashboard</a></li>
        {!location.pathname.includes("revise") && !location.pathname.includes("edit") && !location.pathname.includes("extend") && !location.pathname.includes("new") &&
          <li className="dropdown">
            <a href="#" id="create-menu" tabIndex="2" className="dropdown-toggle cdc-navbar-item create-menu" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-clipboard item-navbar-icon" aria-hidden="true"></i>Create<span className="caret"></span></a>
            <ul className="cdc-nav-dropdown">
              <li className="nav-dropdown-item"><Link to="/responseSets/new" tabIndex="2"><text className="sr-only">Click link to create new </text>Response Sets</Link></li>
              <li className="nav-dropdown-item"><Link to="/questions/new" tabIndex="2"><text className="sr-only">Click link to create new </text>Questions</Link></li>
              <li className="nav-dropdown-item"><Link to="/sections/new" tabIndex="2"><text className="sr-only">Click link to create new </text>Sections</Link></li>
              <li className="nav-dropdown-item"><Link to="/surveys/new" tabIndex="2"><text className="sr-only">Click link to create new </text>Surveys</Link></li>
            </ul>
          </li>
        }
        <li className="dropdown notification-dropdown">
          <NotificationDropdown notifications={notifications} notificationCount={notificationCount} />
          { notificationCount > 0 ? (
            <NotificationMenu notifications={notifications} />
          ) : (
            <ul className="cdc-nav-dropdown">
              <li className="notification-menu-item">No new notifications</li>
            </ul>
          )}
        </li>
      </ul>
    );
  }
  return null;
};
SignedInMenu.propTypes = {
  currentUser: currentUserProps,
  location: PropTypes.object,
  notifications: PropTypes.arrayOf(PropTypes.object),
  notificationCount: PropTypes.number
};

class Header extends Component {
  constructor(props){
    super(props);
    this.state={
      joyrideOverlay: false,
      joyrideType: 'continuous',
      isReady: false,
      isRunning: false,
      stepIndex: 0,
      steps: [],
      selector: ''
    };
    this.renderJoyride = this.renderJoyride.bind(this);
    this.addSteps = this.addSteps.bind(this);
  }

  componentWillMount() {
    this.props.fetchNotifications();
  }

  componentDidMount() {
    this.addSteps(this.props.steps);
    setTimeout(() => {
      this.setState({
        isReady: true,
        isRunning: false,
      });
    }, 1000);
  }

  addSteps(steps) {
    let newSteps = steps;
    if (!Array.isArray(newSteps)) {
      newSteps = [newSteps];
    }
    if (!newSteps.length) {
      return;
    }

    this.setState(currentState => {
      currentState.steps = currentState.steps.concat(newSteps);
      return currentState;
    });
  }

  renderJoyride(isReady, isRunning, joyrideOverlay, joyrideType, selector, stepIndex) {
    return (
      <Joyride
        ref={c => (this.joyride = c)}
        debug={false}
        locale={{
          back: (<span tabIndex='3'>Back</span>),
          close: (<span tabIndex='3'>Close</span>),
          last: (<span tabIndex='3'>End</span>),
          next: (<span tabIndex='3'>Next</span>),
          skip: (<span className='darker-text' tabIndex='3'>Exit Tutorial</span>),
        }}
        autoStart={true}
        run={isRunning}
        showOverlay={joyrideOverlay}
        showSkipButton={true}
        showStepsProgress={true}
        stepIndex={stepIndex}
        steps={this.props.steps}
        type={joyrideType}
        tooltipOffset={0}
        keyboardNavigation={false}
      />
    );
  }

  render() {
    const {
      isReady,
      isRunning,
      joyrideOverlay,
      joyrideType,
      selector,
      stepIndex,
    } = this.state;

    return (
      <nav className="cdc-utlt-nav">
        <div className="container">
          {isReady && <div>{this.renderJoyride(isReady, isRunning, joyrideOverlay, joyrideType, selector, stepIndex)}</div>}
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            </button>
            <Link to="/" className="cdc-brand" tabIndex="2">CDC Vocabulary Service</Link>
          </div>
          <SignedInMenu currentUser={this.props.currentUser} location={this.props.location} notifications={this.props.notifications} notificationCount={this.props.notificationCount} />
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="cdc-nav cdc-utlt-navbar-nav navbar-right">
              <ContentMenu currentUser={this.props.currentUser} settingsOpener={this.props.settingsOpener} />
              <LoginMenu currentUser={this.props.currentUser} logInOpener={this.props.logInOpener} signUpOpener={this.props.signUpOpener} disableUserRegistration={this.props.disableUserRegistration}/>
              <li className="dropdown">
                <a href="#" id = "help-menu" tabIndex="2" className="dropdown-toggle cdc-navbar-item help-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-question-circle utlt-navbar-icon" aria-hidden="true"></i>Help<span className="caret"></span></a>
                <ul className="cdc-nav-dropdown">
                  <li className="nav-dropdown-item"><Link to='/Help' tabIndex="2">Help Documentation</Link></li>
                  {isReady && this.props.steps.length > 0 &&
                    <li><a href="#" tabIndex="2" onClick={(e) => {
                      e.preventDefault();
                      return this.joyride.reset(true);
                    }}>Step-by-Step Walkthrough</a></li>
                  }
                  <li className="nav-dropdown-item"><a href="/api/" tabIndex="2" target="_blank">Swagger API</a></li>
                  <li role="separator" className="divider"></li>
                  <li className="nav-dropdown-item"><span className="version-display">Release: v{this.props.appVersion}</span></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
    currentUser: state.currentUser,
    steps: state.tutorialSteps,
    notificationCount: state.notifications.length
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchNotifications}, dispatch);
}

Header.propTypes = {
  currentUser: currentUserProps,
  steps: PropTypes.array,
  location: PropTypes.object,
  appVersion: PropTypes.string,
  notifications: PropTypes.arrayOf(PropTypes.object),
  notificationCount: PropTypes.number,
  fetchNotifications: PropTypes.func,
  logInOpener: PropTypes.func.isRequired,
  signUpOpener: PropTypes.func.isRequired,
  settingsOpener: PropTypes.func.isRequired,
  disableUserRegistration: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
