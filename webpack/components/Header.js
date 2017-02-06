import React from 'react';
import { Link } from 'react-router';
import currentUserProps from '../prop-types/current_user_props';

let LoginMenu = ({currentUser={email:null}}) => {
  let loggedIn = currentUser ? true : false;
  if(!loggedIn) {
    return (
      <ul className="nav navbar-nav navbar-right">
        <li>
          <a href="#">Login </a>
        </li>
        <li>
          <a href="#"> Register </a>
        </li>
      </ul>
    );
  }
  return null;

};

LoginMenu.propTypes = {
  currentUser: currentUserProps,
};

let ContentMenu = ({currentUser={email:false}}) => {
  let loggedIn = currentUser ? true : false;
  if(loggedIn) {
    let {email} = currentUser;
    return(
      <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul className="cdc-nav cdc-utlt-navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" id="account-dropdown" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-cog utlt-navbar-icon" aria-hidden="true"></i>{email}<span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li><a href="#"> My Stuff</a></li>
              <li><a href="/users/edit">Settings</a></li>
              <li><a href="#">Saved Searches</a></li>
              <li><a href="#">System Activity</a></li>
              <li role="separator" className="divider"></li>
              <li>
                <a href="#">Logout</a>
              </li>
            </ul>
          </li>
          <li><a href="#"><i className="fa fa-question-circle utlt-navbar-icon" aria-hidden="true"></i>Help</a></li>
        </ul>
      </div>
    );
  }
  return false;
};
ContentMenu.propTypes = {
  currentUser: currentUserProps,
};

let SignedInMenu = ({currentUser={email:false}}) => {
  let loggedIn = currentUser ? true : false;
  if(loggedIn) {
    return (
      <ul className="cdc-nav cdc-utlt-navbar-nav">
        <li className="active"><a href="#" className="cdc-navbar-item"><i className="fa fa-bar-chart item-navbar-icon" aria-hidden="true"></i>Dashboard</a></li>
        <li className="dropdown">
          <a href="#" className="dropdown-toggle cdc-navbar-item" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-clipboard item-navbar-icon" aria-hidden="true"></i>Create<span className="caret"></span></a>
          <ul className="cdc-nav-dropdown">
            <li className="nav-dropdown-item"><Link to="/questions/new">Questions</Link></li>
            <li className="nav-dropdown-item"><Link to="/question_types/new">Question Types</Link></li>
            <li className="nav-dropdown-item"><Link to="/responseSets/new">Response Sets</Link></li>
            <li className="nav-dropdown-item"><Link to="/forms/new">Forms</Link></li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#notifications" className="dropdown-toggle cdc-navbar-item" id="notification-dropdown"  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>

        </li>
      </ul>
    );
  }
  return null;
};
SignedInMenu.propTypes = {
  currentUser: currentUserProps,
};

let Header = ({currentUser}) => {
  return (
    <nav className="cdc-utlt-nav navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          </button>
          <Link to="/" className="cdc-brand">CDC Vocabulary Service</Link>
        </div>
        <SignedInMenu currentUser={currentUser} />
        <LoginMenu currentUser={currentUser} />
        <ContentMenu currentUser={currentUser} />
      </div>

    </nav>
  );
};
Header.propTypes = {
  currentUser: currentUserProps,
};

export default Header;
