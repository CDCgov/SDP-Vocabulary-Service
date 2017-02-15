import {
  FETCH_CURRENT_USER,
  LOG_IN
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

export function logIn(user, callback=null) {
  const authenticityToken = getCSRFToken();
  const postPromise = axios.post('/users/sign_in',
                      {user, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (callback) {
    postPromise.then(callback);
  }
  return {
    type: LOG_IN,
    payload: postPromise
  };
}
