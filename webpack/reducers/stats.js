import {
  FETCH_STATS_FULFILLED,
  SET_STATS
} from '../actions/types';

export default function stats(state = {}, action) {
  if (action.type === FETCH_STATS_FULFILLED) {
    return action.payload.data;
  } else if (action.type === SET_STATS) {
    return action.payload;
  }
  return state;
}
