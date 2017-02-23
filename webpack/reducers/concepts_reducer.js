import _ from 'lodash';
import {
  FETCH_CONCEPTS_FULFILLED
} from '../actions/types';

export default function concepts(state = {}, action) {
  switch (action.type) {
    case FETCH_CONCEPTS_FULFILLED:
      var newState = {}
      newState[action.payload.config.params.system] = action.payload.data.expansion.contains;
      return newState;
    default:
      return state;
  }
}
