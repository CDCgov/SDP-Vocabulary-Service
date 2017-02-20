import _ from 'lodash';
import {
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTIONS_FULFILLED,
  DELETE_QUESTION_FULFILLED
} from '../actions/types';

function addQuestionToState(action, state){
  const questionClone = Object.assign({}, state);
  questionClone[action.payload.data.id] = action.payload.data;
  return questionClone;
}

export default function questions(state = {}, action) {
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      return Object.assign(_.keyBy(action.payload.data, 'id'), state);
    case SAVE_QUESTION_FULFILLED:
    case FETCH_QUESTION_FULFILLED:
      return addQuestionToState(action, state);
    case DELETE_QUESTION_FULFILLED:
      return _.omitBy(state,(v, k)=>{
        return action.payload.data.id==k;
      });
    default:
      return state;
  }
}
