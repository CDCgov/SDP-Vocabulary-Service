import axios from 'axios';
import routes from '../routes';
import {
  FETCH_PUBLIC_INFO
} from './types';

export function fetchPublicInfo(id,type) {
  return {
    type: FETCH_PUBLIC_INFO,
    payload: axios.get(routes.publicInfoPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { id: id, type: type }
    })
  };
}
