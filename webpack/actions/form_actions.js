import axios from 'axios';
import routes from '../routes';
import { deleteObject } from './action_helpers';
import { getCSRFToken } from './index';
import {
  ADD_FORM,
  REMOVE_FORM,
  REORDER_FORM,
  FETCH_FORMS,
  FETCH_FORM,
  SAVE_FORM,
  SAVE_DRAFT_FORM,
  CREATE_FORM,
  PUBLISH_FORM,
  DELETE_FORM
} from './types';

export function newForm() {
  return {
    type: CREATE_FORM
  };
}

export function addForm(survey, form) {
  return {
    type: ADD_FORM,
    payload: {survey, form}
  };
}

export function removeForm(survey, index) {
  return {
    type: REMOVE_FORM,
    payload: {survey, index}
  };
}

export function reorderForm(survey, index, direction) {
  return {
    type: REORDER_FORM,
    payload: {survey, index, direction}
  };
}

export function deleteForm(id, callback=null) {
  return {
    type: DELETE_FORM,
    payload: deleteObject(routes.formPath(id), callback)
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
     {authenticityToken}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function saveForm(form, successHandler=null, failureHandler=null) {
  const fn = axios.post;
  const postPromise = createPostPromise(form, routes.formsPath(), fn, successHandler, failureHandler);
  return {
    type: SAVE_FORM,
    payload: postPromise
  };
}

export function saveDraftForm(form, successHandler=null, failureHandler=null) {
  const fn = axios.put;
  const postPromise = createPostPromise(form, routes.formPath(form.id), fn, successHandler, failureHandler);
  return {
    type: SAVE_DRAFT_FORM,
    payload: postPromise
  };
}

function createPostPromise(form, url, fn, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  form.questionsAttributes = form.questions;
  const postPromise = fn(url,
                      {form, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }

  return postPromise;
}
