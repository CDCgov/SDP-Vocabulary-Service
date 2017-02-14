import axios from 'axios';
import routes from '../routes';
import {
  FETCH_QUESTION_TYPES
} from './types';

export function fetchQuestionTypes() {
  return {
    type: FETCH_QUESTION_TYPES,
    payload: axios.get(routes.questionTypesPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
