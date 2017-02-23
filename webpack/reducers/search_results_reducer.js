import {
  FETCH_SEARCH_RESULTS_FULFILLED,
} from '../actions/types';

export default function searchResults(state = {}, action) {
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED:
      return action.payload.data;
    default:
      return state;
  }
}
