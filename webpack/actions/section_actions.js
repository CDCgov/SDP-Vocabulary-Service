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
  ADD_SECTION_TO_GROUP,
  REMOVE_SECTION_FROM_GROUP,
  DELETE_SECTION,
  ADD_ENTITIES,
  UPDATE_SECTION_TAGS,
  UPDATE_PDV,
  ADD_NESTED_ITEM,
  REORDER_NESTED_ITEM,
  REMOVE_NESTED_ITEM
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
