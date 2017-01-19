import axios from 'axios';
import routes from '../routes';
import {
  FETCH_FORMS
} from './types';

export function fetchForms() {
  return {
    type: FETCH_FORMS,
    payload: axios.get(routes.forms_path(), {
      headers: {'Accept': 'application/json'}
    })
  };
}
