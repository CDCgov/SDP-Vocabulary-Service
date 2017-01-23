import React from 'react';
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
        <li className="active"><a href="/" className="cdc-navbar-item"><i className="fa fa-bar-chart item-navbar-icon" aria-hidden="true"></i>Dashboard</a></li>
        <li className="dropdown">
          <a href="#" className="dropdown-toggle cdc-navbar-item" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-clipboard item-navbar-icon" aria-hidden="true"></i>Create<span className="caret"></span></a>
          <ul className="cdc-nav-dropdown">
            <li className="nav-dropdown-item"><a href="/questions/new">Questions</a></li>
            <li className="nav-dropdown-item"><a href="/question_types/new">Question Types</a></li>
            <li className="nav-dropdown-item"><a href="/response_sets/new">Response Sets</a></li>
            <li className="nav-dropdown-item"><a href="/forms/new">Forms</a></li>
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
          <a className="cdc-brand" href="/">CDC Vocabulary Service</a>
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


/*
<nav class="cdc-utlt-nav navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      </button>
      <a class="cdc-brand" href="/">CDC Vocabulary Service</a>
    </div>

    <% if user_signed_in? == false %>
      <ul class="nav navbar-nav navbar-right">
        <%= render 'devise/menu/registration_items' %>
        <%= render 'devise/menu/login_items' %>
      </ul>
    <% else %>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="cdc-nav cdc-utlt-navbar-nav navbar-right">
          <li class="dropdown">
            <a href="#" id="account-dropdown" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog utlt-navbar-icon" aria-hidden="true"></i><%= current_user.email %><span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><%= link_to "My Stuff", mystuff_path %></li>
              <li><a href="/users/edit">Settings</a></li>
              <li><a href="#">Saved Searches</a></li>
              <li><a href="#">System Activity</a></li>
              <li role="separator" class="divider"></li>
              <li><%= render 'devise/menu/login_items'%></li>
            </ul>
          </li>
          <li><a href="#"><i class="fa fa-question-circle utlt-navbar-icon" aria-hidden="true"></i>Help</a></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    <% end %>
  </div>

  <nav class="cdc-nav-main" role="navigation">
    <div class="container">
      <% if user_signed_in? %>
      <ul class="nav cdc-navbar-nav">
        <li class="active"><a href="/" class="cdc-navbar-item"><i class="fa fa-bar-chart item-navbar-icon" aria-hidden="true"></i>Dashboard</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle cdc-navbar-item" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-clipboard item-navbar-icon" aria-hidden="true"></i>Create<span class="caret"></span></a>
          <ul class="cdc-nav-dropdown">
            <li class="nav-dropdown-item"><a href="/questions/new">Questions</a></li>
            <li class="nav-dropdown-item"><a href="/question_types/new">Question Types</a></li>
            <li class="nav-dropdown-item"><a href="/response_sets/new">Response Sets</a></li>
            <li class="nav-dropdown-item"><a href="/forms/new">Forms</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#notifications" class="dropdown-toggle cdc-navbar-item" id="notification-dropdown"  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>
          <% if current_user.notifications.exists? && current_user.notifications.where('read' => false).count > 0 %>
            <ul id="notification-menu" class="cdc-nav-dropdown">
            </ul>
          <% else %>
            <ul class="cdc-nav-dropdown">
              <ul><li class="notification-menu-item">No new notifications</li></ul>
            </ul>
          <% end %>
        </li>
      </ul>
      <% end %>
    </div>
    <% if user_signed_in? && current_user.notifications.where('read' => false).exists? %>
      <script type="application/json" id="notification-json">
        <%= raw current_user.notifications.where('read' => false).to_json %>
      </script>
      <%= javascript_include_tag *webpack_asset_paths('notification_menu', extension: 'js') %>
      <%= javascript_include_tag *webpack_asset_paths('notification_dropdown', extension: 'js') %>
    <% elsif user_signed_in? %>
      <%= javascript_include_tag *webpack_asset_paths('notification_dropdown', extension: 'js') %>
    <% end %>
  </nav>
</nav>

*/
