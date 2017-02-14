import {
  FETCH_QUESTION_TYPE_FULFILLED,
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

const questionTypesFromQuestions = store => next => action => {
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      const questions = action.payload.data;
      questions.forEach((q) => {
        if(q.questionType){
          store.dispatch({type: FETCH_QUESTION_TYPE_FULFILLED, payload: {data: q.questionType}});
          q.questionTypeId = q.questionType.id;
        }
      });
      break;
    case FETCH_QUESTION_FULFILLED:
    case SAVE_QUESTION_FULFILLED:
      if(action.payload.data.questionType){
        store.dispatch({type: FETCH_QUESTION_TYPE_FULFILLED, payload: {data: action.payload.data.questionType}});
        action.payload.data.questionTypeId = action.payload.data.questionType.id;
      }
  }
  next(action);
};

export default questionTypesFromQuestions;
