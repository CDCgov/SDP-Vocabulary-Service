import React, { Component, PropTypes } from 'react';

class Notification extends Component {
  render() {
    return (
      <div>
        <li className="nav-dropdown-item" onClick={() => this.onNotificationClick(this.props.notification.id, this.props.notification.url)}>{this.props.notification.message}</li>
      </div>
    );
  }

  onNotificationClick(id) {
    this.props.onNotifClick(id);
  }
}

Notification.propTypes = {
  notification: React.PropTypes.object,
  onNotifClick: React.PropTypes.func
};

export default Notification;
