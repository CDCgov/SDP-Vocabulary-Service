import axios from 'axios';

import {
  FETCH_STATS
} from './types';

export function fetchStats() {
  return {
    type: FETCH_STATS,
    payload: axios.get('/landing/stats',
                       {headers: {'X-Key-Inflection': 'camel'}})
  };
}
