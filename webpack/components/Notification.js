import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Notification extends Component {
  render() {
    return (
      <div>
        <li className="notification-menu-item" tabIndex="2" onClick={() => this.onNotificationClick(this.props.notification.url)}>{this.props.notification.message}</li>
      </div>
    );
  }

  onNotificationClick(url) {
    this.props.onNotifClick(url);
  }
}

Notification.propTypes = {
  notification: PropTypes.object,
  onNotifClick: PropTypes.func
};

export default Notification;
