import _ from 'lodash';
import {
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

function addQuestionToState(action, state){
  const questionClone = Object.assign({}, state);
  questionClone[action.payload.data.id] = action.payload.data;
  return questionClone;
}

export default function questions(state = {}, action) {
  //Object.freeze(state);
  switch (action.type) {
    case ADD_QUESTION:
      return addQuestionToState(action, state);
    case REMOVE_QUESTION:
      return _.omitBy(state,(v, k)=>{
        return action.payload!=k;
      });
    case REORDER_QUESTION:
      return state;
    case FETCH_QUESTIONS_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    case FETCH_QUESTION_FULFILLED:
      const questionClone = Object.assign({}, state);
      questionClone[action.payload.data.id] = action.payload.data;
      return questionClone;
    default:
      return state;
  }
}
