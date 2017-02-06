import _ from 'lodash';

import {
  FETCH_RESPONSE_TYPES_FULFILLED,
  FETCH_RESPONSE_TYPE_FULFILLED,
} from '../actions/types';

export default function responseTypes(state = {}, action) {
  switch (action.type) {
    case FETCH_RESPONSE_TYPE_FULFILLED:
      const responseTypeClone = Object.assign({}, state);
      responseTypeClone[action.payload.data.id] = action.payload.data;
      return responseTypeClone;
    case FETCH_RESPONSE_TYPES_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    default:
      return state;
  }
}
