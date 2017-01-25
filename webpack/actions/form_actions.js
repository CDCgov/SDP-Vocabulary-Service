import axios from 'axios';
import routes from '../routes';
import {
  FETCH_FORMS,
  FETCH_FORM
} from './types';

export function fetchForms(searchTerms) {
  return {
    type: FETCH_FORMS,
    payload: axios.get(routes.formsPath(), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      },
      params: { search: searchTerms }
    })
  };
}

export function fetchForm(id) {
  return {
    type: FETCH_FORM,
    payload: axios.get(routes.formPath(id), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      }
    })
  };
}

export function fetchForm(formId) {
  return {
    type: FETCH_FORM,
    payload: axios.get(routes.formPath(formId), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      }
    })
  };
}
