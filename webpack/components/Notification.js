import React, { Component, PropTypes } from 'react';

export default class Notification extends Component {
  render() {
    return (
      <div className="notifcation">
        <li onClick={() => this.onNotificationClick(this.props.notification.id, this.props.notification.url)}>{this.props.notification.message}</li>
      </div>
    );
  }

  onNotificationClick(id) {
    this.props.onNotifClick(id);
  }
}

Notification.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.integer,isRequired,
    url: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    read: PropTypes.boolean,
    created_at: PropTypes.datetime
  }),
  onNotifClick: React.PropTypes.func
};
