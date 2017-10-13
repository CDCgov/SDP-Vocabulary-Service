import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  FETCH_SURVEILLANCE_PROGRAMS,
  ADD_PROGRAM
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

export function addProgram(name, description=null, acronym=null, callback=null, failureHandler=null) {
  const postPromise = axios.post(routes.surveillanceProgramsPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    name, description, acronym
  });
  if (callback) {
    postPromise.then(callback);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }
  return {
    type: ADD_PROGRAM,
    payload: postPromise
  };
}
