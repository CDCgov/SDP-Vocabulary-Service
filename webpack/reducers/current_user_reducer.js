import {
  FETCH_CURRENT_USER_FULFILLED
} from '../actions/types';

export default function currentUser(state = {}, action) {
  if (action.type === FETCH_CURRENT_USER_FULFILLED) {
    return action.payload.data;
  } else {
    return state;
  }
}
