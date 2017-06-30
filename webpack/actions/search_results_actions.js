import axios from 'axios';
import routes from '../routes';
import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS,
  SET_LAST_SEARCH
} from './types';

export function fetchSearchResults(context, searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false) {
  return {
    type: FETCH_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter }
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

export function setLastSearch(searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false) {
  return {
    type: SET_LAST_SEARCH,
    payload: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter }
  };
}
