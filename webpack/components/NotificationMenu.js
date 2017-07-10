import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';

export default class NotificationMenu extends Component {
  constructor(props){
    super(props);

    this.state = {
      notifications: props.notifications
    };
  }

  notificationClick(url) {
    if (url.includes(window.location.pathname)) {
      window.location.reload();
    }
    window.location.hash = '';
    window.location = url;
  }

  render() {
    return (
      <ul className="cdc-nav-dropdown">
        <ul className="notification-menu">
          {this.props.notifications.map((notif) => {
            return(
              <Notification key={notif.id} notification={notif} onNotifClick={(url) => this.notificationClick(url)} />
            );
          })}
        </ul>
      </ul>
    );
  }
}

NotificationMenu.propTypes = {
  notifications: PropTypes.arrayOf(Notification.propTypes.notification)
};
