import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  FETCH_NOTIFICATIONS,
  READ_NOTIFICATIONS
} from './types';

export function readNotifications(notificationIds) {
  return {
    type: READ_NOTIFICATIONS,
    payload: axios.post(routes.notifications_mark_read_path(), {
      authenticityToken: getCSRFToken(),
      ids: [notificationIds]
    })
  };
}

export function fetchNotifications() {
  return {
    type: FETCH_NOTIFICATIONS,
    payload: axios.get(routes.notificationsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
