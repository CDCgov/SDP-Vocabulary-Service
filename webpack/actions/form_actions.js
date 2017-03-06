import axios from 'axios';
import routes from '../routes';
import {
  FETCH_FORMS,
  FETCH_FORM,
  SAVE_FORM,
  CREATE_FORM,
  PUBLISH_FORM
} from './types';
import { getCSRFToken } from './index';

export function newForm() {
  return {
    type: CREATE_FORM
  };
}

export function fetchMyForms(searchTerms) {
  return {
    type: FETCH_FORMS,
    payload: axios.get(routes.myFormsPath(), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      },
      params: { search: searchTerms }
    })
  };
}

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

export function publishForm(id) {
  const authenticityToken = getCSRFToken();
  return {
    type: PUBLISH_FORM,
    payload: axios.put(routes.publishFormPath(id),
     {authenticityToken}, {headers: { 'Accept': 'application/json'}})
  };
}

export function saveForm(form, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  form.questionsAttributes = form.questions;
  const postPromise = axios.post(routes.formsPath(),
                      {form, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler ) {
    postPromise.catch(failureHandler);
  }
  return {
    type: SAVE_FORM,
    payload: postPromise
  };
}
