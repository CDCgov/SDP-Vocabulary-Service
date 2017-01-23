import axios from 'axios';
import routes from '../routes';
import {
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  FETCH_QUESTIONS
} from './types';

export function addQuestion(question) {
  return {
    type: ADD_QUESTION,
    payload: question
  };
}

export function removeQuestion(index) {
  return {
    type: REMOVE_QUESTION,
    payload: index
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
      headers: {'Accept': 'application/json'},
      params:  { search: searchTerms }
    })
  };
}
