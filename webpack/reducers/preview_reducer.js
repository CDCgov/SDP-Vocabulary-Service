import {
  FETCH_RESPONSE_SET_PREVIEW_FULFILLED
} from '../actions/types';

export default function preview(state = {}, action) {
  if (action.type === FETCH_RESPONSE_SET_PREVIEW_FULFILLED) {
    return action.payload.data;
  }
  return state;
}
