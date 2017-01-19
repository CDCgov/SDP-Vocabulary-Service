import {
  FETCH_FORMS_FULFILLED
} from '../actions/types';

const initialState = null;

export default function forms(state = initialState, action) {
  if (action.type == FETCH_FORMS_FULFILLED) {
    return [...action.payload.data];
  }
  return state;
}
