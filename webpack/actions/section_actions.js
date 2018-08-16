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
  RETIRE_SECTION,
  ADD_SECTION_TO_GROUP,
  REMOVE_SECTION_FROM_GROUP,
  DELETE_SECTION,
  ADD_ENTITIES,
  UPDATE_SECTION_TAGS,
  UPDATE_PDV,
  ADD_NESTED_ITEM,
  REORDER_NESTED_ITEM,
  UPDATE_STAGE_SECTION,
  REMOVE_NESTED_ITEM,
  SECTION_REQUEST,
  FETCH_SECTION_SUCCESS,
  FETCH_SECTION_FAILURE,
  RESET_SECTION_REQUEST
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

export function deleteSection(id, cascade, callback=null) {
  return {
    type: DELETE_SECTION,
    payload: deleteObject(routes.sectionPath(id), cascade, callback)
  };
}

export function oldfetchSection(id) {
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

function requestSection() {
  return {
    type: SECTION_REQUEST
  };
}

export function resetSectionRequest() {
  return {
    type: RESET_SECTION_REQUEST
  };
}

function fetchSectionSuccess(section) {
  const normalizedData = normalize(section, sectionSchema);
  return {
    type: FETCH_SECTION_SUCCESS,
    payload: normalizedData.entities
  };
}

function fetchSectionFailure(error) {
  let status, statusText;
  if (!error.response) {
    status = `${error.message}`;
    statusText = `${error.stack}`;
  } else {
    status = `${error.response.status}`;
    statusText = `${error.response.statusText}`;
  }
  return {
    type: FETCH_SECTION_FAILURE,
    status,
    statusText
  };
}

function sendSectionRequest(id) {
  return new Promise((resolve,reject) => {
    axios.get(routes.sectionPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      timeout:1000*60*5 // 5 minutes
    })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function fetchSection(id) {
  return (dispatch,getState) => {
    dispatch(requestSection(id));
    return sendSectionRequest(id)
      .then(data => dispatch(fetchSectionSuccess(data)))
      .catch(error => dispatch(fetchSectionFailure(error)));
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

export function retireSection(id) {
  const authenticityToken = getCSRFToken();
  return {
    type: RETIRE_SECTION,
    payload: axios.put(routes.retireSectionPath(id),
     {authenticityToken}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function updateStageSection(id, stage) {
  const authenticityToken = getCSRFToken();
  return {
    type: UPDATE_STAGE_SECTION,
    payload: axios.put(routes.updateStageSectionPath(id),
     {authenticityToken, stage}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function addSectionToGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: ADD_SECTION_TO_GROUP,
    payload: axios.put(routes.addToGroupSectionPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function removeSectionFromGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: REMOVE_SECTION_FROM_GROUP,
    payload: axios.put(routes.removeFromGroupSectionPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function saveSection(section, comment, successHandler=null, failureHandler=null) {
  const fn = axios.post;
  const postPromise = createPostPromise(section, comment, routes.sectionsPath(), fn, successHandler, failureHandler);
  return {
    type: SAVE_SECTION,
    payload: postPromise
  };
}

export function saveDraftSection(section, comment, successHandler=null, failureHandler=null) {
  const fn = axios.put;
  const postPromise = createPostPromise(section, comment, routes.sectionPath(section.id), fn, successHandler, failureHandler);
  return {
    type: SAVE_DRAFT_SECTION,
    payload: postPromise
  };
}

export function updateSectionTags(id, conceptsAttributes) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.update_tags_section_path(id),
                      {id, authenticityToken, conceptsAttributes},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  return {
    type: UPDATE_SECTION_TAGS,
    payload: putPromise
  };
}

export function addNestedItem(section, nestedItem, type='question') {
  return {
    type: ADD_NESTED_ITEM,
    payload: {section, nestedItem, type}
  };
}

export function removeNestedItem(section, index) {
  return {
    type: REMOVE_NESTED_ITEM,
    payload: {section, index}
  };
}

export function reorderNestedItem(section, index, direction) {
  return {
    type: REORDER_NESTED_ITEM,
    payload: {section, index, direction}
  };
}

export function updatePDV(id, sniId, pdv) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.update_pdv_section_path(id),
                      {sniId, pdv, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  return {
    type: UPDATE_PDV,
    payload: putPromise
  };
}

function createPostPromise(section, comment, url, fn, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  section.questionsAttributes = section.questions;
  const postPromise = fn(url,
                      {section, comment, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }

  return postPromise;
}
