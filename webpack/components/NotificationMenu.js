import React, { Component, PropTypes } from 'react';
import Notification from './Notification';
import axios from 'axios';

const querystring = require('querystring');

export default class NotificationMenu extends Component {
  constructor(props){
    super(props);

    this.state = {
      notifications: props.notifactions
    };
  }

  notificationClick(id, url) {
    console.log(id);
    console.log(url);
    console.log("/notifications/mark_read?ids=" + id);

    axios.post(("/notifications/mark_read?ids=" + id))
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    //window.location = url;
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
