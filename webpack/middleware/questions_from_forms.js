import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED,
  FETCH_QUESTION_FROM_MIDDLE_FULFILLED,
  FETCH_QUESTIONS_FROM_MIDDLE_FULFILLED
} from '../actions/types';

import { dispatchIfNotPresent, dispatchCollectionMembersIfNotPresent } from './store_helper';

const questionsFromForms = store => next => action => {
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      const forms = action.payload.data;
      forms.forEach((f) => {
        if (f.questions) {
          f.questions.forEach((q) => {
            dispatchIfNotPresent(store, 'questions', q, FETCH_QUESTION_FROM_MIDDLE_FULFILLED);
          });
          f.questions = f.questions.map((q) => {
            return ({id: q.id, content: q.content });
          });
        }
      });
      break;
    case FETCH_FORM_FULFILLED:
      if (action.payload.data.questions) {
        dispatchCollectionMembersIfNotPresent(store, 'questions', action.payload.data.questions, FETCH_QUESTIONS_FROM_MIDDLE_FULFILLED);
      }
      action.payload.data.questions = action.payload.data.questions.map((q) => {
        return ({id: q.id, content: q.content });
      });
      break;
  }
  next(action);
};
export default questionsFromForms;
