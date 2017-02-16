import {
  FETCH_CURRENT_USER,
  LOG_IN,
  SIGN_UP
} from './types';

import { getCSRFToken } from './index';
import axios from 'axios';

export function fetchCurrentUser() {
  return {
    type: FETCH_CURRENT_USER,
    payload: axios.get('/authentications',
      {headers: {'X-Key-Inflection': 'camel',
        'Accept': 'application/json'}})
  };
}

export function logIn(user, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  const postPromise = axios.post('/users/sign_in',
                      {user, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }
  if (successHandler) {
    postPromise.then(successHandler);
  }
  return {
    type: LOG_IN,
    payload: postPromise
  };
}

export function signUp(user, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  const postPromise = axios.post('/users',
                      {user, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }
  if (successHandler) {
    postPromise.then(successHandler);
  }
  return {
    type: SIGN_UP,
    payload: postPromise
  };
}
