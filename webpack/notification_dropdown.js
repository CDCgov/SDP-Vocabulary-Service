import React from 'react';
import ReactDOM from 'react-dom';
import NotificationDropdown from './components/NotificationDropdown';

var notifDoc = document.getElementById('notification-json');

console.log(notifDoc)

if(notifDoc != null){
  const notifications = JSON.parse(document.getElementById('notification-json').innerHTML);
  const notificationCount = notifications.length
  ReactDOM.render(<NotificationDropdown notifications={notifications} notificationCount={notificationCount} />, document.getElementById('notification-dropdown'));
}
else {
  const notifications = [];
  const notificationCount = notifications.length
  ReactDOM.render(<NotificationDropdown notifications={notifications} notificationCount={notificationCount} />, document.getElementById('notification-dropdown'));
}