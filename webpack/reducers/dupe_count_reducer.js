import {
  FETCH_DUPLICATE_COUNT_FULFILLED,
  CLEAR_AJAX_STATUS
} from '../actions/types';

export default function dupeCount(state = 0, action) {
  if (action.type === FETCH_DUPLICATE_COUNT_FULFILLED) {
    return action.payload.data;
  } else if (action.type === CLEAR_AJAX_STATUS) {
    return 0;
  }
  return state;
}
