import {
  FETCH_RESPONSE_TYPE_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTION_FROM_MIDDLE_FULFILLED,
  FETCH_QUESTIONS_FROM_MIDDLE_FULFILLED,
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const responseTypesFromQuestions = store => next => action => {
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
    case FETCH_QUESTIONS_FROM_MIDDLE_FULFILLED:
      const questions = action.payload.data;
      questions.forEach((q) => {
        if (q.responseType) {
          dispatchIfNotPresent(store, 'responseTypes', q.responseType, FETCH_RESPONSE_TYPE_FULFILLED);
          q.responseTypeId = q.responseType.id;
        }
      });
      break;
    case FETCH_QUESTION_FULFILLED:
    case FETCH_QUESTION_FROM_MIDDLE_FULFILLED:
    case SAVE_QUESTION_FULFILLED:
      if (action.payload.data.responseType) {
        dispatchIfNotPresent(store, 'responseTypes', action.payload.data.responseType, FETCH_RESPONSE_TYPE_FULFILLED);
        action.payload.data.responseTypeId = action.payload.data.responseType.id;
      }
  }
  next(action);
};

export default responseTypesFromQuestions;
