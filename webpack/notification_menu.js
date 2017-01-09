import React from 'react';
import ReactDOM from 'react-dom';
import NotificationMenu from './components/NotificationMenu';

const notifications = JSON.parse(document.getElementById('notification-json').innerHTML);
ReactDOM.render(<NotificationMenu notifications={notifications} />, document.getElementById('notification-menu'));
