import axios from 'axios';
import routes from '../routes';
import {
  FETCH_SURVEILLANCE_SYSTEMS
} from './types';

export function fetchSurveillanceSystems() {
  return {
    type: FETCH_SURVEILLANCE_SYSTEMS,
    payload: axios.get(routes.surveillanceSystemsPath(), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      }
    })
  };
}
