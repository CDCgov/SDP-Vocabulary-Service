import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_MORE_SEARCH_RESULTS_FULFILLED
} from '../actions/types';

import cloneDeep from 'lodash/cloneDeep';

export default function searchResults(state = {}, action) {
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED:
      const stateClone = Object.assign({}, state);
      stateClone[action.meta.context] = action.payload.data;
      return stateClone;
    case FETCH_MORE_SEARCH_RESULTS_FULFILLED:
      const newStateClone = cloneDeep(state);
      const hits = newStateClone[action.meta.context].hits;
      hits.hits = hits.hits.concat(action.payload.data.hits.hits);
      return newStateClone;
    default:
      return state;
  }
}
