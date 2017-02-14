import axios from 'axios';
import routes from '../routes';
import {
  FETCH_RESPONSE_SETS,
  FETCH_RESPONSE_SET,
  SAVE_RESPONSE_SET
} from './types';

import { getCSRFToken } from './index';

export function fetchResponseSets(searchTerms) {
  return {
    type: FETCH_RESPONSE_SETS,
    payload: axios.get(routes.responseSetsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { search: searchTerms }
    })
  };
}

export function fetchResponseSet(id) {
  return {
    type: FETCH_RESPONSE_SET,
    payload: axios.get(routes.responseSetPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function saveResponseSet(responseSet, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  const postPromise = axios.post(routes.responseSetsPath(),
                      {responseSet, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }
  if (successHandler) {
    postPromise.then(successHandler);
  }

  return {
    type: SAVE_RESPONSE_SET,
    payload: postPromise
  };
}
