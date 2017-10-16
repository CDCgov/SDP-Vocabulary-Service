import axios from 'axios';
import { normalize } from 'normalizr';
import { sectionSchema } from '../schema';
import routes from '../routes';
import { deleteObject } from './action_helpers';
import { getCSRFToken } from './index';
import {
  ADD_SECTION,
  REMOVE_SECTION,
  REORDER_SECTION,
  SAVE_SECTION,
  SAVE_DRAFT_SECTION,
  CREATE_SECTION,
  PUBLISH_SECTION,
  DELETE_SECTION,
  ADD_ENTITIES
} from './types';

export function newSection() {
  return {
    type: CREATE_SECTION
  };
}

export function addSection(survey, section) {
  return {
    type: ADD_SECTION,
    payload: {survey, section}
  };
}

export function removeSection(survey, index) {
  return {
    type: REMOVE_SECTION,
    payload: {survey, index}
  };
}

export function reorderSection(survey, index, direction) {
  return {
    type: REORDER_SECTION,
    payload: {survey, index, direction}
  };
}

export function deleteSection(id, callback=null) {
  return {
    type: DELETE_SECTION,
    payload: deleteObject(routes.sectionPath(id), callback)
  };
}

export function fetchSection(id) {
  return {
    type: ADD_ENTITIES,
    payload: axios.get(routes.sectionPath(id), {
      headers: {
        'X-Key-Inflection': 'camel',
        'Accept': 'application/json'
      }
    }).then((response) => {
      const normalizedData = normalize(response.data, sectionSchema);
      return normalizedData.entities;
    })
  };
}

export function publishSection(id) {
  const authenticityToken = getCSRFToken();
  return {
    type: PUBLISH_SECTION,
    payload: axios.put(routes.publishSectionPath(id),
     {authenticityToken}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function saveSection(section, successHandler=null, failureHandler=null) {
  const fn = axios.post;
  const postPromise = createPostPromise(section, routes.sectionsPath(), fn, successHandler, failureHandler);
  return {
    type: SAVE_SECTION,
    payload: postPromise
  };
}

export function saveDraftSection(section, successHandler=null, failureHandler=null) {
  const fn = axios.put;
  const postPromise = createPostPromise(section, routes.sectionPath(section.id), fn, successHandler, failureHandler);
  return {
    type: SAVE_DRAFT_SECTION,
    payload: postPromise
  };
}

function createPostPromise(section, url, fn, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  section.questionsAttributes = section.questions;
  const postPromise = fn(url,
                      {section, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }

  return postPromise;
}
