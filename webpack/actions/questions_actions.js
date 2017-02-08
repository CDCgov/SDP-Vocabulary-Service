import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  ADD_QUESTION,
  REMOVE_QUESTION,
  DELETE_QUESTION,
  REORDER_QUESTION,
  SAVE_QUESTION,
  FETCH_QUESTION,
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

export function deleteQuestion(id, csrf) {
  return {
    type: DELETE_QUESTION,
    payload: axios.delete(routes.questions_path()+'/'+id, {
      headers: {'Accept': 'application/json'},
      params:  {'authenticity_token': csrf}
    })
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

export function saveQuestion(question, callback=null) {
  const authenticityToken  = getCSRFToken();
  const linkedResponseSets = question.linkedResponseSets;
  delete question.linkedResponseSets;
  const postPromise = axios.post(routes.questionsPath(),
                      {question, authenticityToken, linkedResponseSets},
                      {headers: {'X-Key-Inflection': 'camel', 'Accept': 'application/json'}});
  if (callback) {
    postPromise.then(callback);
  }
  return {
    type: SAVE_QUESTION,
    payload: postPromise
  };
}
