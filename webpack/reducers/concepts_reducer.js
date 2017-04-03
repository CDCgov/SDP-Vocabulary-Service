import {
  FETCH_CONCEPTS_FULFILLED,
  FETCH_CONCEPTS_REJECTED
} from '../actions/types';

export default function concepts(state = {}, action) {
  switch (action.type) {
    case FETCH_CONCEPTS_FULFILLED:
      var newState = {};
      newState[action.payload.config.params.system] = action.payload.data.expansion.contains;
      return newState;
    case FETCH_CONCEPTS_REJECTED:
      return {error: 'Concept Service could not be reached, please try again later.'};
    default:
      return state;
  }
}
