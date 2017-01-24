import axios from 'axios';
import routes from '../routes';
import {
  FETCH_RESPONSE_SETS,
  FETCH_RESPONSE_SET
} from './types';

export function fetchResponseSets() {
  return {
    type: FETCH_RESPONSE_SETS,
    payload: axios.get(routes.responseSetsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function fetchResponseSet(id) {
  return {
    type: FETCH_RESPONSE_SET,
    payload: axios.get(routes.responseSetPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
