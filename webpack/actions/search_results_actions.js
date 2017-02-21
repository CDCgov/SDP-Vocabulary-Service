import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  FETCH_SEARCH_RESULTS
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
