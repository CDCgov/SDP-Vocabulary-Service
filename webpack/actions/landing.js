import axios from 'axios';

import {
  FETCH_STATS,
  SET_STATS,
  CLEAR_AJAX_STATUS
} from './types';

export function fetchStats() {
  return {
    type: FETCH_STATS,
    payload: axios.get('/landing/stats',
                       {headers: {'X-Key-Inflection': 'camel'}})
  };
}

export function setStats(stats) {
  return {
    type: SET_STATS,
    payload: stats
  };
}

export function clearAjaxStatus() {
  return {
    type: CLEAR_AJAX_STATUS
  };
}
