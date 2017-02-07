import {
  FETCH_NOTIFICATIONS_FULFILLED
} from '../actions/types';

export default function stats(state = [], action) {
  if (action.type === FETCH_NOTIFICATIONS_FULFILLED) {
    return action.payload.data;
  }
  return state;
}
