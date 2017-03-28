import {
  FETCH_QUESTIONS_FULFILLED,
  FETCH_QUESTION_FULFILLED
} from '../actions/types';

import dispatchIfNotPresent from './store_helper';

const parentFromQuestions = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      const questions = action.payload.data;
      questions.forEach((q) => {
        if(q.parent){
          dispatchIfNotPresent(store, 'questions', q.parent, FETCH_QUESTION_FULFILLED);
          q.parent = ({id: q.parent.id, name: q.parent.content});
        }
      });
      break;
    case FETCH_QUESTION_FULFILLED:
      if(action.payload.data.parent) {
        const parent = action.payload.data.parent;
        dispatchIfNotPresent(store, 'questions', parent, FETCH_QUESTION_FULFILLED);
        action.payload.data.parent = ({id: parent.id, name: parent.content});
      }
  }

  next(action);
};

export default parentFromQuestions;
