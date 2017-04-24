import axios from 'axios';
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
  FETCH_QUESTION,
  FETCH_QUESTION_USAGE,
  FETCH_QUESTIONS
} from './types';

export function addQuestion(form, question) {
  return {
    type: ADD_QUESTION,
    payload: {form, question}
  };
}

export function removeQuestion(form, index) {
  return {
    type: REMOVE_QUESTION,
    payload: {form, index}
  };
}

export function deleteQuestion(id, callback=null) {
  return {
    type: DELETE_QUESTION,
    payload: deleteObject(routes.question_path(id), callback)
  };
}

export function reorderQuestion(form, index, direction) {
  return {
    type: REORDER_QUESTION,
    payload: {form, index, direction}
  };
}

export function fetchQuestions(searchTerms) {
  return {
    type: FETCH_QUESTIONS,
    payload: axios.get(routes.questionsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params:  { search: searchTerms }
    })
  };
}

export function fetchQuestion(id) {
  return {
    type: FETCH_QUESTION,
    payload: axios.get(routes.questionPath(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
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
  const linkedResponseSets = question.linkedResponseSets;
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
  const linkedResponseSets = question.linkedResponseSets;
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
