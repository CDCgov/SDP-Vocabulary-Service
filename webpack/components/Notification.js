import React, { Component } from 'react';

class Notification extends Component {
  render() {
    return (
      <div>
        <li className="notification-menu-item" onClick={() => this.onNotificationClick(this.props.notification.id, this.props.notification.url)}>{this.props.notification.message}</li>
      </div>
    );
  }

  onNotificationClick(id, url) {
    this.props.onNotifClick(id, url);
  }
}

Notification.propTypes = {
  notification: React.PropTypes.object,
  onNotifClick: React.PropTypes.func
};

export default Notification;
