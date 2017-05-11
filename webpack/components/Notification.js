import React, { Component } from 'react';

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
  notification: React.PropTypes.object,
  onNotifClick: React.PropTypes.func
};

export default Notification;
