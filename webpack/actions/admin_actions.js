import axios from 'axios';
import routes from '../routes';
import {
  FETCH_ADMINS
} from './types';

export function fetchAdmins() {
  return {
    type: FETCH_ADMINS,
    payload: axios.get(routes.adminsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
