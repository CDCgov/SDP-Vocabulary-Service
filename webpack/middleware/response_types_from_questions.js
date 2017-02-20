import {
  FETCH_RESPONSE_TYPE_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

const responseTypesFromQuestions = store => next => action => {
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      const questions = action.payload.data;
      questions.forEach((q) => {
        if(q.responseType){
          store.dispatch({type: FETCH_RESPONSE_TYPE_FULFILLED, payload: {data: q.responseType}});
          q.responseTypeId = q.responseType.id;
        }
      });
      break;
    case FETCH_QUESTION_FULFILLED:
    case SAVE_QUESTION_FULFILLED:
      if(action.payload.data.responseType){
        store.dispatch({type: FETCH_RESPONSE_TYPE_FULFILLED, payload: {data: action.payload.data.responseType}});
        action.payload.data.responseTypeId = action.payload.data.responseType.id;
      }
  }
  next(action);
};

export default responseTypesFromQuestions;
