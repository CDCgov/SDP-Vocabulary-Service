import axios from 'axios';
import routes from '../routes';
import {
  FETCH_RESPONSE_SETS
} from './types';

export function fetchResponseSets() {
  return {
    type: FETCH_RESPONSE_SETS,
    payload: axios.get(routes.responseSetsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
