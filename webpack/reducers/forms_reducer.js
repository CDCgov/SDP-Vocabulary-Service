import {
  FETCH_FORMS_FULFILLED
} from '../actions/types';
import _ from 'lodash';

const initialState = {'loading': true};

export default function forms(state = initialState, action) {
  if (action.type == FETCH_FORMS_FULFILLED) {
    return _.keyBy(action.payload.data, 'id');
  }
  return state;
}
