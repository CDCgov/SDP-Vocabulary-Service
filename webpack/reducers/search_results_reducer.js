import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_MORE_SEARCH_RESULTS_FULFILLED
} from '../actions/types';

import cloneDeep from 'lodash/cloneDeep';

export default function searchResults(state = {}, action) {
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED:
      const stateClone = Object.assign({}, state);
      if(state['PAGE'] && (stateClone[action.meta.context].hits.hits.length !== (state['PAGE']*10))) {
        const allHits = cloneDeep(state)[action.meta.context].hits.hits;
        stateClone[action.meta.context] = action.payload.data;
        for(var i = state['PAGE']*10; i < allHits.length; i++) {
          stateClone[action.meta.context].hits.hits.push(allHits[i]);
        }
      } else {
        stateClone[action.meta.context] = action.payload.data;
      }
      return stateClone;
    case FETCH_MORE_SEARCH_RESULTS_FULFILLED:
      const newStateClone = cloneDeep(state);
      const hits = newStateClone[action.meta.context].hits;
      newStateClone['PAGE'] = action.meta.page;
      hits.hits = hits.hits.concat(action.payload.data.hits.hits);
      return newStateClone;
    default:
      return state;
  }
}
