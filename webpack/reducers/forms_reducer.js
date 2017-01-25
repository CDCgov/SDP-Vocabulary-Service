import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED
} from '../actions/types';
import _ from 'lodash';

const initialState = null;

export default function forms(state = initialState, action) {
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    case FETCH_FORM_FULFILLED:
      const formClone = Object.assign({}, state);
      formClone[action.payload.data.id] = action.payload.data;
      return formClone;
    default:
      return state;
  }
}
