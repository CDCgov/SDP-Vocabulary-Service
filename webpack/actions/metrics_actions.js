import axios from 'axios';
import routes from '../routes';

import {
  FETCH_METRICS
} from './types';

export function fetchMetrics(callback=null) {
  const getPromise = axios.get(routes.metricsPath(), {
    headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
  });
  if (callback) {
    getPromise.then(callback);
  }
  return {
    type: FETCH_METRICS,
    payload: getPromise
  };
}
