import axios from 'axios';
import routes from '../routes';
import {
  FETCH_RESPONSE_SETS,
  FETCH_RESPONSE_SET,
  SAVE_RESPONSE_SET,
  SAVE_DRAFT_RESPONSE_SET,
  PUBLISH_RESPONSE_SET
} from './types';

import { getCSRFToken } from './index';

export function fetchMyResponseSets(searchTerms) {
  return {
    type: FETCH_RESPONSE_SETS,
    payload: axios.get(routes.myResponseSetsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { search: searchTerms }
    })
  };
}

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

function createPostPromise(responseSet, url, fn, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  const postPromise = fn(url,
                      {responseSet, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }

  return postPromise;
}

export function saveResponseSet(responseSet, successHandler=null, failureHandler=null) {
  const fn = axios.post;
  const postPromise = createPostPromise(responseSet, routes.responseSetsPath(), fn, successHandler, failureHandler);
  return {
    type: SAVE_RESPONSE_SET,
    payload: postPromise
  };
}

export function saveDraftResponseSet(responseSet, successHandler=null, failureHandler=null) {
  const fn = axios.put;
  const postPromise = createPostPromise(responseSet, routes.responseSetPath(responseSet.id), fn, successHandler, failureHandler);
  return {
    type: SAVE_DRAFT_RESPONSE_SET,
    payload: postPromise
  };
}

export function publishResponseSet(id, callback=null) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.publishResponseSetPath(id),
    {authenticityToken},
    {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}
    });
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: PUBLISH_RESPONSE_SET,
    payload: putPromise
  };
}
