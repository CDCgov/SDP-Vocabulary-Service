import axios from 'axios';
import { normalize } from 'normalizr';
import { responseSetSchema } from '../schema';
import routes from '../routes';
import { deleteObject } from './action_helpers';
import { getCSRFToken } from './index';
import store from '../store/configure_store';

import {
  FETCH_RESPONSE_SET_USAGE,
  SAVE_RESPONSE_SET,
  SAVE_DRAFT_RESPONSE_SET,
  PUBLISH_RESPONSE_SET,
  RETIRE_RESPONSE_SET,
  ADD_RESPONSE_SET_TO_GROUP,
  REMOVE_RESPONSE_SET_FROM_GROUP,
  DELETE_RESPONSE_SET,
  UPDATE_STAGE_RESPONSE_SET,
  ADD_ENTITIES,
  FETCH_RESPONSE_SET_PENDING,
  FETCH_RESPONSE_SET_SUCCESS,
  FETCH_RESPONSE_SET_FAILURE,
  FETCH_MORE_RESPONSES,
  UPDATE_RESPONSE_SET_TAGS,
  FETCH_RESPONSE_SET_PREVIEW
} from './types';

const AJAX_TIMEOUT = 1000 * 60 * 5;  // 5 minutes

export function deleteResponseSet(id, callback=null) {
  return {
    type: DELETE_RESPONSE_SET,
    payload: deleteObject(routes.responseSetPath(id), false, callback)
  };
}

export function fetchResponseSet(id, isEdit=null) {
  store.dispatch({type:FETCH_RESPONSE_SET_PENDING});
  var params  = {isEdit: isEdit};
  return {
    type: ADD_ENTITIES,
    payload: axios.get(routes.responseSetPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      timeout : AJAX_TIMEOUT,
      params
    }).then((rsResponse) => {
      const normalizedData = normalize(rsResponse.data, responseSetSchema);
      store.dispatch(fetchResponseSetSuccess(rsResponse.data));
      return normalizedData.entities;
    })
    .catch( (error) => {
      store.dispatch(fetchResponseSetFailure(error));
      throw(new Error(error));
    })

  };
}

export function fetchResponseSetPreview(id) {
  return {
    type: FETCH_RESPONSE_SET_PREVIEW,
    payload: axios.get(routes.responseSetPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      timeout: AJAX_TIMEOUT
    })
  };
}

export function fetchMoreResponses(id, page=0) {
  return {
    type: FETCH_MORE_RESPONSES,
    payload: axios.get(routes.moreResponsesResponseSetPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      timeout: AJAX_TIMEOUT,
      params: {page: page}
    })
  };
}

export function updateResponseSetTags(id, tagList) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.update_tags_response_set_path(id),
                      {id, authenticityToken, tagList},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  return {
    type: UPDATE_RESPONSE_SET_TAGS,
    payload: putPromise
  };
}

function fetchResponseSetSuccess(rsResponse) {
  const normalizedData = normalize(rsResponse, responseSetSchema);
  return {
    type: FETCH_RESPONSE_SET_SUCCESS,
    payload: normalizedData.entities
  };
}

function fetchResponseSetFailure(error) {
  let status, statusText;
  if (!error.response) {
    status = `${error.message}`;
    statusText = `${error.stack}`;
  } else {
    status = `${error.response.status}`;
    statusText = `${error.response.statusText}`;
  }
  return {
    type: FETCH_RESPONSE_SET_FAILURE,
    status,
    statusText
  };
}

export function fetchResponseSetUsage(id) {
  return {
    type: FETCH_RESPONSE_SET_USAGE,
    payload: axios.get(routes.usageResponseSetPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

function createPostPromise(responseSet, comment, unsavedState, associationChanges, url, fn, successHandler=null, failureHandler=null) {
  const authenticityToken = getCSRFToken();
  const postPromise = fn(url,
                      {responseSet, comment, unsavedState, associationChanges, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (successHandler) {
    postPromise.then(successHandler);
  }
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }

  return postPromise;
}

export function saveResponseSet(responseSet, comment, unsavedState, associationChanges, successHandler=null, failureHandler=null) {
  const fn = axios.post;
  const postPromise = createPostPromise(responseSet, comment, unsavedState, associationChanges, routes.responseSetsPath(), fn, successHandler, failureHandler);
  return {
    type: SAVE_RESPONSE_SET,
    payload: postPromise
  };
}

export function saveDraftResponseSet(responseSet, comment, unsavedState, associationChanges, successHandler=null, failureHandler=null) {
  const fn = axios.put;
  const postPromise = createPostPromise(responseSet, comment, unsavedState, associationChanges, routes.responseSetPath(responseSet.id), fn, successHandler, failureHandler);
  return {
    type: SAVE_DRAFT_RESPONSE_SET,
    payload: postPromise
  };
}

export function publishResponseSet(id, callback=null) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.publishResponseSetPath(id),
    {authenticityToken},
    {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}
    });
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: PUBLISH_RESPONSE_SET,
    payload: putPromise
  };
}

export function retireResponseSet(id, callback=null) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.retireResponseSetPath(id),
    {authenticityToken},
    {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}
    });
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: RETIRE_RESPONSE_SET,
    payload: putPromise
  };
}

export function updateStageResponseSet(id, stage) {
  const authenticityToken = getCSRFToken();
  return {
    type: UPDATE_STAGE_RESPONSE_SET,
    payload: axios.put(routes.updateStageResponseSetPath(id),
     {authenticityToken, stage}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function addResponseSetToGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: ADD_RESPONSE_SET_TO_GROUP,
    payload: axios.put(routes.addToGroupResponseSetPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function removeResponseSetFromGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: REMOVE_RESPONSE_SET_FROM_GROUP,
    payload: axios.put(routes.removeFromGroupResponseSetPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}
