import axios from 'axios';
import routes from '../routes';
import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS
} from './types';

export function fetchSearchResults(searchTerms=null, type=null) {
  return {
    type: FETCH_SEARCH_RESULTS,
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms }
    })
  };
}

export function fetchMoreSearchResults(searchTerms=null, type=null, page) {
  console.log("from action");
  console.log(page)
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { type: type, search: searchTerms, page: page }
    })
  };
}
