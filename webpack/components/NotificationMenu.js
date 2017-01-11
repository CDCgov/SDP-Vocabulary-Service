import React, { Component, PropTypes } from 'react';
import Notification from './Notification';
import { readNotification } from '../actions/notification';

export default class NotificationMenu extends Component {
  constructor(props){
    super(props);

    this.state = {
      notifications: props.notifications
    };
  }

  notificationClick(id, url) {
    readNotification(id);
    // Redirect to the url in notification:
    if (url.includes(window.location.pathname)) {
      window.location.reload();
    }
    window.location.hash = '';
    window.location = url;
  }

  render() {
    return (
      <div className="notification-menu">
        <ul>
          {this.props.notifications.map((notif) => {
            return(
              <Notification key={notif.id} notification={notif} onNotifClick={(id, url) => this.notificationClick(id, url)} />
            );
          })}
        </ul>
      </div>
    );
  }
}

NotificationMenu.propTypes = {
  notifications: PropTypes.arrayOf(Notification.propTypes.notification)
};
