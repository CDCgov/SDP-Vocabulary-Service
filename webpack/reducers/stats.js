import {
  FETCH_STATS_FULFILLED
} from '../actions/types';

export default function stats(state = {}, action) {
  if (action.type === FETCH_STATS_FULFILLED) {
    return action.payload.data;
  }
  return state;
}
