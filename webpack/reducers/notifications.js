import {
  FETCH_NOTIFICATIONS_FULFILLED
} from '../actions/types';

export default function fetchNotifications(state = [], action) {
  if (action.type === FETCH_NOTIFICATIONS_FULFILLED) {
    return action.payload.data.filter((notif) => notif.read === false);
  }
  return state;
}
