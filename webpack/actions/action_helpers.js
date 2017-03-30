import axios from 'axios';
import { getCSRFToken } from './index';

export function deleteObject(deletePath, callback) {
  const authenticityToken = getCSRFToken();
  let data = new FormData();
  data.append('authenticity_token', authenticityToken);
  data.append('_method', 'delete');
  const delPromise = axios.request({
    url: deletePath,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Key-Inflection': 'camel',
      'Accept': 'application/json'
    }
  });
  if (callback) {
    delPromise.then(callback);
  }
  return delPromise;
}
