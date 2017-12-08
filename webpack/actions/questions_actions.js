import axios from 'axios';
import { normalize } from 'normalizr';
import { questionSchema } from '../schema';
import routes from '../routes';
import { deleteObject } from './action_helpers';
import { getCSRFToken } from './index';
import {
  ADD_QUESTION,
  REMOVE_QUESTION,
  DELETE_QUESTION,
  REORDER_QUESTION,
  SAVE_QUESTION,
  SAVE_DRAFT_QUESTION,
  PUBLISH_QUESTION,
  ADD_QUESTION_TO_GROUP,
  FETCH_QUESTION_USAGE,
  ADD_ENTITIES
} from './types';

export function addQuestion(section, question) {
  return {
    type: ADD_QUESTION,
    payload: {section, question}
  };
}

export function removeQuestion(section, index) {
  return {
    type: REMOVE_QUESTION,
    payload: {section, index}
  };
}

export function deleteQuestion(id, callback=null) {
  return {
    type: DELETE_QUESTION,
    payload: deleteObject(routes.question_path(id), callback)
  };
}

export function reorderQuestion(section, index, direction) {
  return {
    type: REORDER_QUESTION,
    payload: {section, index, direction}
  };
}

export function fetchQuestion(id) {
  return {
    type: ADD_ENTITIES,
    payload: axios.get(routes.questionPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    }).then((response) => {
      const normalizedData = normalize(response.data, questionSchema);
      return normalizedData.entities;
    })
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

export function saveQuestion(question, successHandler=null, failureHandler=null) {
  const authenticityToken  = getCSRFToken();
  const linkedResponseSets = question.linkedResponseSets ? question.linkedResponseSets.map((rs) => rs.id) : [];
  delete question.linkedResponseSets;
  const postPromise = axios.post(routes.questionsPath(),
                      {question, authenticityToken, linkedResponseSets},
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

export function saveDraftQuestion(id, question, callback=null) {
  const authenticityToken  = getCSRFToken();
  const linkedResponseSets = question.linkedResponseSets ? question.linkedResponseSets.map((rs) => rs.id) : [];
  delete question.linkedResponseSets;
  const putPromise = axios.put(routes.questions_path()+'/'+id,
                      {question, authenticityToken, linkedResponseSets},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (callback) {
    putPromise.then(callback);
  }
  return {
    type: SAVE_DRAFT_QUESTION,
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

export function addQuestionToGroup(id, group) {
  const authenticityToken = getCSRFToken();
  return {
    type: ADD_QUESTION_TO_GROUP,
    payload: axios.put(routes.addToGroupQuestionPath(id),
     {authenticityToken, group}, {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}})
  };
}
