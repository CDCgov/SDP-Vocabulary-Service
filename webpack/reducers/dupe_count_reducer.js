import {
  FETCH_DUPLICATE_COUNT_FULFILLED
} from '../actions/types';

export default function dupeCount(state = 0, action) {
  if (action.type === FETCH_DUPLICATE_COUNT_FULFILLED) {
    return action.payload.data;
  }
  return state;
}
