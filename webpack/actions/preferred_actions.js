import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  ADD_PREFERRED,
  REMOVE_PREFERRED
} from './types';

export function addPreferred(id, type, callback=null) {
  const authenticityToken = getCSRFToken();
  const putPromise = axios.put(routes.adminAddPreferredLabelPath(),
              {id, type, authenticityToken}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: ADD_PREFERRED,
    payload: putPromise
  };
}

export function removePreferred(id, type, callback=null) {
  const authenticityToken = getCSRFToken();
  const putPromise = axios.put(routes.adminRemovePreferredLabelPath(),
              {id, type, authenticityToken}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: REMOVE_PREFERRED,
    payload: putPromise
  };
}
