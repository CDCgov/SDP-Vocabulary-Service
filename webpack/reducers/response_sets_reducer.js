import _ from 'lodash';

import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED
} from '../actions/types';

const initialState = null;

export default function responseSets(state = initialState, action) {
  switch (action.type) {
    case FETCH_RESPONSE_SETS_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    case FETCH_RESPONSE_SET_FULFILLED:
      const responseSetClone = Object.assign({}, state);
      responseSetClone[action.payload.data.id] = action.payload.data;
      return responseSetClone;
    default:
      return state;
  }
}
