import axios from 'axios';
import routes from '../routes';
import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS
} from './types';

export function fetchSearchResults(searchTerms=null, type=null, programFilter=[], systemFilter=[]) {
  return {
    type: FETCH_SEARCH_RESULTS,
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, programs: programFilter, systems: systemFilter }
    })
  };
}

export function fetchMoreSearchResults(searchTerms=null, type=null, page, programFilter=[], systemFilter=[]) {
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, page: page, programs: programFilter, systems: systemFilter }
    })
  };
}
