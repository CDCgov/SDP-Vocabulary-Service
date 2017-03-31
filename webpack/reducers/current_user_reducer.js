import {
  FETCH_CURRENT_USER_FULFILLED,
  LOG_IN_FULFILLED,
  SIGN_UP_FULFILLED,
  LOG_OUT
} from '../actions/types';

export default function currentUser(state = {}, action) {
  switch (action.type) {
    case SIGN_UP_FULFILLED:
    case LOG_IN_FULFILLED:
    case FETCH_CURRENT_USER_FULFILLED:
      return action.payload.data;
    case LOG_OUT:
      // In this case we want to blank out currentUser because our session has been invalidated.
      // This will force the user to log back in.
      return {};
    default:
      return state;
  }
}
