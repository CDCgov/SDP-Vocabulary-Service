import axios from 'axios';
import routes from '../routes';
import {
  FETCH_SURVEY
} from './types';
import { getCSRFToken } from './index';


export function fetchSurvey(id) {
  return {
    type: FETCH_SURVEY,
    payload: axios.get(routes.surveyPath(id), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      }
    })
  };
}
