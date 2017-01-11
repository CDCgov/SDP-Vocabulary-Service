import React, { Component, PropTypes } from 'react';
import Notification from './Notification';
import routes from '../routes';
import axios from 'axios';
import { readNotification } from '../actions/notification';

function getCSRFToken() {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    if (meta.getAttribute('name') === 'csrf-token') {
      return meta.getAttribute('content');
    }
  }
  return null;
}

export default class NotificationMenu extends Component {
  constructor(props){
    super(props);

    this.state = {
      notifications: props.notifactions
    };
  }

  notificationClick(id, url) {
    readNotification(id);
    // Redirect to the url in notification:
    console.log(url.includes(window.location.pathname));
    if (url.includes(window.location.pathname)) {
      window.location.reload();
    }
    window.location.hash = ''
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
