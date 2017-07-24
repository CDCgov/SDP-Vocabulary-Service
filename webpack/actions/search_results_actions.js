import axios from 'axios';
import { normalize } from 'normalizr';
import { searchResultsSchema } from '../schema';
import routes from '../routes';
import store from '../store/configure_store';
import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS,
  SET_LAST_SEARCH,
  FETCH_LAST_SEARCH,
  ADD_ENTITIES_FULFILLED
} from './types';

export function fetchSearchResults(context, searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false) {
  return {
    type: FETCH_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter }
    }).then((response) => {
      console.log(response.data.hits.hits);
      const normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      console.log(normalizedData);
      return response;
    })
  };
}

export function fetchLastSearch(context, searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false, pages) {
  let querySize = pages*10;
  return {
    type: FETCH_LAST_SEARCH,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter, size: querySize }
    })
  };
}

export function fetchMoreSearchResults(context, searchTerms=null, type=null, page, programFilter=[], systemFilter=[], myStuffFilter=false) {
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, page: page, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter }
    })
  };
}

export function setLastSearch(searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false, page=1) {
  return {
    type: SET_LAST_SEARCH,
    payload: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter, page: page }
  };
}
