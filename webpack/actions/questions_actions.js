import axios from 'axios';
import routes from '../routes';
import {
  ADD_QUESTION,
  REMOVE_QUESTION,
  DELETE_QUESTION,
  REORDER_QUESTION,
  FETCH_QUESTION,
  FETCH_QUESTIONS
} from './types';

export function addQuestion(question) {
  return {
    type: ADD_QUESTION,
    payload: {data: question}
  };
}

export function removeQuestion(index) {
  return {
    type: REMOVE_QUESTION,
    payload: index
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

export function reorderQuestion(index, direction) {
  return {
    type: REORDER_QUESTION,
    payload: {index, direction}
  };
}

export function fetchQuestions(searchTerms) {
  return {
    type: FETCH_QUESTIONS,
    payload: axios.get(routes.questions_path(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params:  { search: searchTerms }
    })
  };
}

export function fetchQuestion(id) {
  return {
    type: FETCH_QUESTION,
    payload: axios.get(routes.question_path(id), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'}
    })
  };
}
