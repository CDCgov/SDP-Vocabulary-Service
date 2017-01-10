import React, { Component, PropTypes } from 'react';
import Notification from './Notification';
import routes from '../routes';
import axios from 'axios';

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
    axios.post(routes.notifications_mark_read_path(), {
      authenticityToken: getCSRFToken(),
      ids: [id]
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

    // Redirect to the url in notification:
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
