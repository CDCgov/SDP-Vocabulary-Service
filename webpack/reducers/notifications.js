import {
  READ_NOTIFICATION_FULFILLED
} from '../actions/types';

export default function notifications(state = [], action) {
  switch (action.type) {
    case READ_NOTIFICATION_FULFILLED:
      return [...action.payload.data];
    default:
      return state;
  }
}
