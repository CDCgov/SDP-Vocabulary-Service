import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_MORE_SEARCH_RESULTS_FULFILLED
} from '../actions/types';

export default function searchResults(state = {}, action) {
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED:
      return action.payload.data;
    case FETCH_MORE_SEARCH_RESULTS_FULFILLED:
      const newStateClone = Object.assign({}, state);
      const searchResultsArray = newStateClone.hits.hits;
      searchResultsArray.push.apply(searchResultsArray, action.payload.data.hits.hits);
      return newStateClone;
    default:
      return state;
  }
}
