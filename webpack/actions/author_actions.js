import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  FETCH_AUTHORS,
  GRANT_AUTHOR,
  REVOKE_AUTHOR
} from './types';

export function fetchAuthors() {
  return {
    type: FETCH_AUTHORS,
    payload: axios.get(routes.authorsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function grantAuthor(email, callback=null, failureHandler=null) {
  const putPromise = axios.put(routes.adminGrantAuthorPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    email: email
  });
  if (callback) {
    putPromise.then(callback);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: GRANT_AUTHOR,
    payload: putPromise
  };
}

export function revokeAuthor(authorId, callback=null, failureHandler=null) {
  const putPromise = axios.put(routes.adminRevokeAuthorPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    authorId: authorId
  });
  if (callback) {
    putPromise.then(callback);
  }
  if (failureHandler) {
    putPromise.catch(failureHandler);
  }
  return {
    type: REVOKE_AUTHOR,
    payload: putPromise
  };
}
