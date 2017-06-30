import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED,
  FETCH_QUESTION_FROM_MIDDLE_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const questionsFromResponseSets = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_RESPONSE_SETS_FULFILLED:
      const responseSets = action.payload.data;
      responseSets.forEach((rs) => {
        if(rs.questions){
          rs.questions.forEach((q) => {
            dispatchIfNotPresent(store, 'questions', q, FETCH_QUESTION_FROM_MIDDLE_FULFILLED);
          });
          rs.questions = rs.questions.map((q) => q.id);
        }
      });
      break;
    case FETCH_RESPONSE_SET_FULFILLED:
      if(action.payload.data.questions){
        action.payload.data.questions.forEach((q) => {
          dispatchIfNotPresent(store, 'questions', q, FETCH_QUESTION_FROM_MIDDLE_FULFILLED);
        });
        action.payload.data.questions = action.payload.data.questions.map((q) => q.id);
      }
  }

  next(action);
};

export default questionsFromResponseSets;
