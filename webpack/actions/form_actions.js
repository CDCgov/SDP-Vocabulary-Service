import axios from 'axios';
import routes from '../routes';
import {
  FETCH_FORMS,
  FETCH_FORM,
  SAVE_FORM
} from './types';
import { getCSRFToken } from './index';


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

export function saveForm(form, callback=null) {
  const authenticityToken = getCSRFToken();
  form.questionsAttributes = form.questions
  const postPromise = axios.post(routes.formsPath(),
                      {form, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (callback) {
    postPromise.then(callback);
  }
  return {
    type: SAVE_FORM,
    payload: postPromise
  };
}
