import React, { Component, PropTypes } from 'react';
import { readNotification } from '../actions/notification';

class NotificationDropdown extends Component {
  constructor(props){
    super(props);

    this.state = {
      notificationCount: props.notificationCount
    };
  }

  onDropdownClick(notifications) {
    var ids = [];
    notifications.forEach((notif) => {
      ids.push(notif.id);
    });
    readNotification(ids);

    this.setState({
      notificationCount: 0
    });
  }

  render() {
    if(this.state.notificationCount > 0){
      return (
        <a href="#notifications" className="dropdown-toggle cdc-navbar-item" id="notification-dropdown"  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={() => this.onDropdownClick(this.props.notifications)}>
          <i className="fa fa-bell item-navbar-icon" aria-hidden="true"></i>
          Alerts
          <span className="caret"></span>
          <span className="alerts-badge">{this.state.notificationCount}</span>
        </a>
      );
    } else {
      return (
        <a href="#notifications" className="dropdown-toggle cdc-navbar-item" id="notification-dropdown"  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          <i className="fa fa-bell item-navbar-icon" aria-hidden="true"></i>
          Alerts
          <span className="caret"></span>
        </a>
      );
    }
  }
}

NotificationDropdown.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
  notificationCount: PropTypes.number
};

export default NotificationDropdown;
