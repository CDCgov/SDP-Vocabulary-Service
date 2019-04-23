import axios from 'axios';
import routes from '../routes';

import {
  FETCH_METRICS
} from './types';

export function fetchMetrics() {
  return {
    type: FETCH_METRICS,
    payload: axios.get(routes.metricsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
