import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED
} from '../actions/types';

const questionsFromResponseSets = store => next => action => {
  if(store == null) return;
  switch (action.type) {
    case FETCH_RESPONSE_SETS_FULFILLED:
      const responseSets = action.payload.data;
      responseSets.forEach((rs) => {
        if(rs.questions){
          //store.dispatch({type: FETCH_QUESTIONS_FULFILLED, payload: {data: rs.questions}});
          rs.questions = rs.questions.map((q) => q.id);
        }
      });
      break;
    case FETCH_RESPONSE_SET_FULFILLED:
      if(action.payload.data.questions){
        //store.dispatch({type: FETCH_QUESTIONS_FULFILLED, payload: {data: action.payload.data.questions}});
        action.payload.data.questions = action.payload.data.questions.map((q) => q.id);
      }
  }

  next(action);
};

export default questionsFromResponseSets;
