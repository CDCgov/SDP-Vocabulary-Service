import {
  ADD_QUESTION,
  REMOVE_QUESTION,
   REORDER_QUESTION
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
