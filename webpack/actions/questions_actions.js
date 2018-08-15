import axios from 'axios';
import { normalize } from 'normalizr';
import { questionSchema } from '../schema';
import routes from '../routes';
import { deleteObject } from './action_helpers';
import { getCSRFToken } from './index';
import {
  DELETE_QUESTION,
  SAVE_QUESTION,
  SAVE_DRAFT_QUESTION,
  PUBLISH_QUESTION,
  RETIRE_QUESTION,
  ADD_QUESTION_TO_GROUP,
  REMOVE_QUESTION_FROM_GROUP,
  FETCH_QUESTION_USAGE,
  QUESTION_REQUEST,
  FETCH_QUESTION_SUCCESS,
  FETCH_QUESTION_FAILURE,
  RESET_QUESTION_REQUEST,
  UPDATE_QUESTION_TAGS,
  UPDATE_STAGE_QUESTION,
  MARK_AS_DUPLICATE,
  LINK_TO_DUPLICATE
} from './types';

export function deleteQuestion(id, cascade=false, callback=null) {
  return {
    type: DELETE_QUESTION,
    payload: deleteObject(routes.question_path(id), cascade, callback)
  };
}

export function markAsDuplicate(id, replacement, survey, type) {
  const authenticityToken = getCSRFToken();
  let route = '';
  if (type === 'question'){
    route = routes.mark_as_duplicate_question_path(id);
  } else {
    route = routes.mark_as_duplicate_response_set_path(id);
  }
  const putPromise = axios.put(route,
                      {replacement, survey, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  return {
    type: MARK_AS_DUPLICATE,
    payload: putPromise
  };
}

export function linkToDuplicate(id, replacement, survey, type) {
  const authenticityToken = getCSRFToken();
  let route = '';
  if (type === 'question'){
    route = routes.link_to_duplicate_question_path(id);
  } else {
    route = routes.link_to_duplicate_response_set_path(id);
  }
  const putPromise = axios.put(route,
                      {replacement, survey, authenticityToken},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  return {
    type: LINK_TO_DUPLICATE,
    payload: putPromise
  };
}

export function fetchQuestionUsage(id) {
  return {
    type: FETCH_QUESTION_USAGE,
    payload: axios.get(routes.usageQuestionPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}

export function saveQuestion(question, comment, successHandler=null, failureHandler=null) {
  const authenticityToken  = getCSRFToken();
  const linkedResponseSets = question.linkedResponseSets ? question.linkedResponseSets.map((rs) => rs.id) : [];
  delete question.linkedResponseSets;
  const postPromise = axios.post(routes.questionsPath(),
                      {question, comment, authenticityToken, linkedResponseSets},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (failureHandler) {
    postPromise.catch(failureHandler);
  }
  if (successHandler) {
    postPromise.then(successHandler);
  }
  return {
    type: SAVE_QUESTION,
    payload: postPromise
  };
}

export function saveDraftQuestion(id, question, comment, callback=null) {
  const authenticityToken  = getCSRFToken();
  const linkedResponseSets = question.linkedResponseSets ? question.linkedResponseSets.map((rs) => rs.id) : [];
  delete question.linkedResponseSets;
  const putPromise = axios.put(routes.questions_path()+'/'+id,
                      {question, comment, authenticityToken, linkedResponseSets},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: SAVE_DRAFT_QUESTION,
    payload: putPromise
  };
}

export function updateQuestionTags(id, conceptsAttributes) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.update_tags_question_path(id),
                      {id, authenticityToken, conceptsAttributes},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  return {
    type: UPDATE_QUESTION_TAGS,
    payload: putPromise
  };
}

export function publishQuestion(id, callback=null) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.publish_question_path(id),
    {authenticityToken},
    {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}
    });
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: PUBLISH_QUESTION,
    payload: putPromise
  };
}

export function retireQuestion(id, callback=null) {
  const authenticityToken  = getCSRFToken();
  const putPromise = axios.put(routes.retire_question_path(id),
    {authenticityToken},
    {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}
    });
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: RETIRE_QUESTION,
    payload: putPromise
  };
}

export function updateStageQuestion(id, stage) {
  const authenticityToken = getCSRFToken();
  return {
    type: UPDATE_STAGE_QUESTION,
    payload: axios.put(routes.updateStageQuestionPath(id),
     {authenticityToken, stage}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function addQuestionToGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: ADD_QUESTION_TO_GROUP,
    payload: axios.put(routes.addToGroupQuestionPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

export function removeQuestionFromGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: REMOVE_QUESTION_FROM_GROUP,
    payload: axios.put(routes.removeFromGroupQuestionPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}

function requestQuestion() {
  return {
    type: QUESTION_REQUEST
  };
}

export function resetQuestionRequest() {
  return {
    type: RESET_QUESTION_REQUEST
  };
}

function fetchQuestionSuccess(question) {
  const normalizedData = normalize(question, questionSchema);
  return {
    type: FETCH_QUESTION_SUCCESS,
    payload: normalizedData.entities
  };
}

function fetchQuestionFailure(error) {
  let status, statusText;
  if (!error.response) {
    status = `${error.message}`;
    statusText = `${error.stack}`;
  } else {
    status = `${error.response.status}`;
    statusText = `${error.response.statusText}`;
  }
  return {
    type: FETCH_QUESTION_FAILURE,
    status,
    statusText
  };
}

function sendQuestionRequest(id) {
  return new Promise((resolve,reject) => {
    axios.get(routes.questionPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      timeout:1000*60*5 // 5 minutes
    })
      .then(result => resolve(result.data))
      .catch(error => reject(error));
  });
}

export function fetchQuestion(id) {
  return (dispatch,getState) => {
    dispatch(requestQuestion(id));
    return sendQuestionRequest(id)
      .then(data => dispatch(fetchQuestionSuccess(data)))
      .catch(error => dispatch(fetchQuestionFailure(error)));
  };
}