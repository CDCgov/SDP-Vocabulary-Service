import {
  FETCH_PUBLIC_INFO_FULFILLED
} from '../actions/types';

export default function publicInfo(state = {}, action) {
  if (action.type === FETCH_PUBLIC_INFO_FULFILLED) {
    return action.payload;
  }
  return state;
}
