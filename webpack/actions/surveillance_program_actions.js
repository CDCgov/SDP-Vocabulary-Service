import axios from 'axios';
import routes from '../routes';
import {
  FETCH_SURVEILLANCE_PROGRAMS
} from './types';

export function fetchSurveillancePrograms() {
  return {
    type: FETCH_SURVEILLANCE_PROGRAMS,
    payload: axios.get(routes.surveillanceProgramsPath(), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      }
    })
  };
}
