import {
  FETCH_CURRENT_USER_FULFILLED
} from '../actions/types';

export default function currentUser(state = {}, action) {
  switch (action.type) {
    case FETCH_CURRENT_USER_FULFILLED:
      return action.payload.data;
    default:
      return state;
  }
}
