import axios from 'axios';
import routes from '../routes';
import {
  FETCH_RESPONSE_TYPES
} from './types';

export function fetchResponseTypes() {
  return {
    type: FETCH_RESPONSE_TYPES,
    payload: axios.get(routes.responseTypesPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
