import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  FETCH_PUBLISHERS,
  GRANT_PUBLISHER,
  REVOKE_PUBLISHER
} from './types';

export function fetchPublishers() {
  return {
    type: FETCH_PUBLISHERS,
    payload: axios.get(routes.publishersPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function grantPublisher(email, callback=null) {
  const putPromise = axios.put(routes.adminGrantPublisherPath(), {
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
  return {
    type: GRANT_PUBLISHER,
    payload: putPromise
  };
}

export function revokePublisher(pubId, callback=null) {
  const putPromise = axios.put(routes.adminRevokePublisherPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    pubId: pubId
  });
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: REVOKE_PUBLISHER,
    payload: putPromise
  };
}
