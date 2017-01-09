import React from 'react';
import ReactDOM from 'react-dom';
import Routes from "./routes";
import NotificationMenu from './components/NotificationMenu';

const notifications = JSON.parse(document.getElementById('notification-json').innerHTML);
ReactDOM.render(<NotificationMenu questions={notifications} />, document.getElementById('notification-menu'));
