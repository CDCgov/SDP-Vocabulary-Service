import {
  FETCH_QUESTION_TYPE_FULFILLED,
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

import dispatchIfNotPresent from './store_helper';

const questionTypesFromQuestions = store => next => action => {
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      const questions = action.payload.data;
      questions.forEach((q) => {
        if (q.questionType) {
          dispatchIfNotPresent(store, 'questionTypes', q.questionType, FETCH_QUESTION_TYPE_FULFILLED);
          q.questionTypeId = q.questionType.id;
        }
      });
      break;
    case FETCH_QUESTION_FULFILLED:
    case SAVE_QUESTION_FULFILLED:
      if (action.payload.data.questionType) {
        dispatchIfNotPresent(store, 'questionTypes', action.payload.data.questionType, FETCH_QUESTION_TYPE_FULFILLED);
        action.payload.data.questionTypeId = action.payload.data.questionType.id;
      }
  }
  next(action);
};

export default questionTypesFromQuestions;
