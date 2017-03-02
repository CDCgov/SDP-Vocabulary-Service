import {
  FETCH_QUESTIONS_FULFILLED,
  FETCH_QUESTION_FULFILLED
} from '../actions/types';

const parentFromQuestions = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      const questions = action.payload.data;
      questions.forEach((q) => {
        if(q.parent){
          //store.dispatch({type: FETCH_QUESTION_FULFILLED, payload: {data: q.parent}});
          q.parent = ({id: q.parent.id, name: q.parent.name});
        }
      });
      break;
    case FETCH_QUESTION_FULFILLED:
      if(action.payload.data.parent){
        //store.dispatch({type: FETCH_QUESTION_FULFILLED, payload: {data: action.payload.data.parent}});
        action.payload.data.parent = ({id: action.payload.data.parent.id, name: action.payload.data.parent.name});
      }
  }

  next(action);
};

export default parentFromQuestions;
