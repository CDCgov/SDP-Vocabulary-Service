import axios from 'axios';
import routes from '../routes';

export function readNotification(notificationIds) {
  axios.post(routes.notifications_mark_read_path(), {
    authenticityToken: getCSRFToken(),
    ids: [notificationIds]
  });
}

function getCSRFToken() {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    if (meta.getAttribute('name') === 'csrf-token') {
      return meta.getAttribute('content');
    }
  }

  return null;
}

