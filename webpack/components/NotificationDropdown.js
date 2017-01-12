import React, { Component, PropTypes } from 'react';
import { readNotification } from '../actions/notification';

export default class NotificationDropdown extends Component {
  constructor(props){
    super(props);

    this.state = {
      notificationCount: props.notificationCount
    };
  }

  onDropdownClick(notifications) {
    var ids = [];
    notifications.forEach((notif) => {
      ids.push(notif.id)
    });
    readNotification(ids);

    this.setState({
      notificationCount: 0
    });
  }

  render() {
    if(this.state.notificationCount > 0){
      return (
        <div className="notif-button" onClick={() => this.onDropdownClick(this.props.notifications)}>
          <i className="fa fa-bell item-navbar-icon" aria-hidden="true"></i>
          Alerts
          <span className="caret"></span>
          <span className="alerts-badge">{this.state.notificationCount}</span>
        </div>
      );
    }
    else{
      return (
        <div className="notif-button">
          <i className="fa fa-bell item-navbar-icon" aria-hidden="true"></i>
          Alerts
          <span className="caret"></span>
        </div>
      );
    }
  }
}

NotificationDropdown.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object),
  notificationCount: PropTypes.number
};