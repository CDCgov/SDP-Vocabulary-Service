import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_MORE_SEARCH_RESULTS_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const responseSetsFromSearch = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_SEARCH_RESULTS_FULFILLED || FETCH_MORE_SEARCH_RESULTS_FULFILLED:
      action.payload.data.hits.hits.map((hit) => {
        if (hit.Type === 'response_set') {
          // Because of the differing serializers between ES and Ruby...
          let responseSet = Object.assign({}, hit.Source);
          responseSet.responses = responseSet.codes;
          delete responseSet["codes"];
          dispatchIfNotPresent(store, 'response_sets', responseSet, FETCH_RESPONSE_SET_FULFILLED);
        }
      });
      break;
  }

  next(action);
};

export default responseSetsFromSearch;
