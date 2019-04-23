import {
  FETCH_METRICS_FULFILLED
} from '../actions/types';

export default function metrics(state = '', action) {
  if (action.type === FETCH_METRICS_FULFILLED) {
    return action.payload.data;
  }
  return state;
}
