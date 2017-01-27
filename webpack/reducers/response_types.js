import _ from 'lodash';

import {
  FETCH_RESPONSE_TYPES_FULFILLED
} from '../actions/types';

export default function responseTypes(state = {}, action) {
  switch (action.type) {
    case FETCH_RESPONSE_TYPES_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    default:
      return state;
  }
}
