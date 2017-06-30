import {
  FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED,
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const responseSetsFromQuestions = store => next => action => {
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      const questions = action.payload.data;
      questions.forEach((q, i) => {
        if (q.responseSets) {
          q.responseSets.forEach((rs) => {
            dispatchIfNotPresent(store, 'responseSets', rs, FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED);
          });
          action.payload.data[i].responseSets = q.responseSets.map((rs) => rs.id);
        }
      });
      break;
    case FETCH_QUESTION_FULFILLED:
    case SAVE_QUESTION_FULFILLED:
      if(action.payload.data.responseSets){
        action.payload.data.responseSets.forEach((rs) => {
          dispatchIfNotPresent(store, 'responseSets', rs, FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED);
        });
        action.payload.data.responseSets = action.payload.data.responseSets.map((rs) => rs.id);
      }
  }

  next(action);
};

export default responseSetsFromQuestions;
