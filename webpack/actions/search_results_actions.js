import axios from 'axios';
import routes from '../routes';
import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS
} from './types';

export function fetchSearchResults(searchTerms=null, type=null, programFilter=[], systemFilter=[], myStuffFilter=false) {
  return {
    type: FETCH_SEARCH_RESULTS,
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter }
    })
  };
}

export function fetchMoreSearchResults(searchTerms=null, type=null, page, programFilter=[], systemFilter=[], myStuffFilter=false) {
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, page: page, programs: programFilter, systems: systemFilter, mystuff: myStuffFilter }
    })
  };
}
