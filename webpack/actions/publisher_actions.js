import axios from 'axios';
import routes from '../routes';
import {
  FETCH_PUBLISHERS
} from './types';

export function fetchPublishers() {
  return {
    type: FETCH_PUBLISHERS,
    payload: axios.get(routes.publishersPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
