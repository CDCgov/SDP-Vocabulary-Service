import {
  FETCH_CURRENT_USER
} from './types';
import axios from 'axios';

export function fetchCurrentUser() {
  return {
    type: FETCH_CURRENT_USER,
    payload: axios.get('/authentications',
      {headers: {'X-Key-Inflection': 'camel',
        'Accept': 'application/json'}})
  };
}
