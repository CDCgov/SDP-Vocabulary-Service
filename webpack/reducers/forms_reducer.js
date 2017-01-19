import {
  FETCH_FORMS_FULFILLED
} from '../actions/types';

export default function forms(state = {}, action) {
  if (action.type == FETCH_FORMS_FULFILLED) {
    return action.payload.data;
  }
  return state;
}
