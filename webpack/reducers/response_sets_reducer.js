import _ from 'lodash';

import {
  FETCH_RESPONSE_SETS_FULFILLED
} from '../actions/types';

const initialState = null;

export default function responseSets(state = initialState, action) {
  switch (action.type) {
    case FETCH_RESPONSE_SETS_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    default:
      return state;
  }
}
