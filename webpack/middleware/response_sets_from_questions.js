import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

const responseSetsFromQuestions = store => next => action => {
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      const questions = action.payload.data;
      questions.forEach((q) => {
        if(q.responseSets){
          store.dispatch({type: FETCH_RESPONSE_SETS_FULFILLED, payload: {data: q.responseSets}});
          q.responseSets = q.responseSets.map((rs) => rs.id);
        }
      });
      break;
    case FETCH_QUESTION_FULFILLED:
      if(action.payload.data.responseSets){
        store.dispatch({type: FETCH_RESPONSE_SETS_FULFILLED, payload: {data: action.payload.data.responseSets}});
        action.payload.data.responseSets = action.payload.data.responseSets.map((rs) => rs.id);
      }
  }

  next(action);
};

export default responseSetsFromQuestions;
