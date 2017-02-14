import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

const questionsFromForms = store => next => action => {
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      const forms = action.payload.data;
      forms.forEach((f) => {
        store.dispatch({
          type: FETCH_QUESTIONS_FULFILLED,
          payload: {data: f.questions}
        });
        f.questions = f.questions.map((q) => {
          return ({id: q.id, content: q.content });
        });
      });
      break;
    case FETCH_FORM_FULFILLED:
      store.dispatch({
        type: FETCH_QUESTIONS_FULFILLED,
        payload: {data: action.payload.data.questions}
      });
      action.payload.data.questions = action.payload.data.questions.map((q) => {
        return ({id: q.id, content: q.content });
      });
      break;
  }
  next(action);
};
export default questionsFromForms;
