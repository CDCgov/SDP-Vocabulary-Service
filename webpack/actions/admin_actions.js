import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  FETCH_ADMINS,
  GRANT_ADMIN,
  REVOKE_ADMIN
} from './types';

export function fetchAdmins() {
  return {
    type: FETCH_ADMINS,
    payload: axios.get(routes.administratorsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function grantAdmin(email) {
  return {
    type: GRANT_ADMIN,
    payload: axios.put(routes.adminGrantAdminPath(), {
      authenticityToken: getCSRFToken(),
      email: email
    })
  };
}

export function revokeAdmin(adminId, callback=null) {
  const putPromise = axios.put(routes.adminRevokeAdminPath(), {
    headers: {
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    },
    authenticityToken: getCSRFToken(),
    adminId: adminId
  });
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: REVOKE_ADMIN,
    payload: putPromise
  };
}
