import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import assign from 'lodash/assign';

import {
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTION_USAGE_FULFILLED,
  FETCH_QUESTIONS_FULFILLED,
  DELETE_QUESTION_FULFILLED,
  FETCH_QUESTION_FROM_MIDDLE_FULFILLED,
  FETCH_QUESTIONS_FROM_MIDDLE_FULFILLED
} from '../actions/types';

function addQuestionToState(action, state){
  const questionsClone = Object.assign({}, state);
  const id = action.payload.data.id;
  const existingQuestion = questionsClone[action.payload.data.id];
  if (existingQuestion) {
    questionsClone[id] = assign(existingQuestion, action.payload.data);
  } else {
    questionsClone[id] = action.payload.data;
  }
  return questionsClone;
}

export default function questions(state = {}, action) {
  switch (action.type) {
    case FETCH_QUESTIONS_FULFILLED:
      return Object.assign({}, state, keyBy(action.payload.data, 'id'));
    case SAVE_QUESTION_FULFILLED:
    case FETCH_QUESTION_FULFILLED:
      return addQuestionToState(action, state);
    case DELETE_QUESTION_FULFILLED:
      return omitBy(state,(v, k)=>{
        return action.payload.data.id==k;
      });
    case FETCH_QUESTION_FROM_MIDDLE_FULFILLED:
      action.payload.data['fromMiddleware'] = true;
      return addQuestionToState(action, state);
    case FETCH_QUESTIONS_FROM_MIDDLE_FULFILLED:
      let newData = action.payload.data.slice();
      newData.forEach((obj) => {
        obj['fromMiddleware'] = true;
      });
      return Object.assign({}, state, _.keyBy(newData, 'id'));
    case FETCH_QUESTION_USAGE_FULFILLED:
      const questionsClone = Object.assign({}, state);
      if (questionsClone[action.payload.data.id] === undefined) {
        questionsClone[action.payload.data.id] = {};
      }
      questionsClone[action.payload.data.id].surveillancePrograms = action.payload.data.surveillancePrograms;
      questionsClone[action.payload.data.id].surveillanceSystems = action.payload.data.surveillanceSystems;
      return questionsClone;
    default:
      return state;
  }
}
