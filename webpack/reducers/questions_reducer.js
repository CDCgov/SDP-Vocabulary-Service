import assign from 'lodash/assign';

import * as helpers from './helpers';

import {
  SAVE_QUESTION_FULFILLED,
  RETIRE_QUESTION_FULFILLED,
  UPDATE_QUESTION_TAGS_FULFILLED,
  UPDATE_STAGE_QUESTION_FULFILLED,
  FETCH_QUESTION_USAGE_FULFILLED,
  FETCH_QUESTION_PARENTS_FULFILLED,
  DELETE_QUESTION_FULFILLED,
  ADD_ENTITIES_FULFILLED,
  ADD_ENTITIES_PENDING,
  ADD_ENTITIES_REJECTED,
  ADD_QUESTION_TO_GROUP_FULFILLED,
  REMOVE_QUESTION_FROM_GROUP_FULFILLED
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
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.questions);
    case ADD_ENTITIES_REJECTED:
      return Object.assign({},state);
    case ADD_ENTITIES_PENDING:
      return Object.assign({},state);
    case SAVE_QUESTION_FULFILLED:
    case UPDATE_QUESTION_TAGS_FULFILLED:
    case UPDATE_STAGE_QUESTION_FULFILLED:
    case ADD_QUESTION_TO_GROUP_FULFILLED:
    case RETIRE_QUESTION_FULFILLED:
    case REMOVE_QUESTION_FROM_GROUP_FULFILLED:
      return addQuestionToState(action, state);
    case DELETE_QUESTION_FULFILLED:
      return helpers.deleteItem(state, action);
    case FETCH_QUESTION_USAGE_FULFILLED:
      const questionsClone = Object.assign({}, state);
      if (questionsClone[action.payload.data.id] === undefined) {
        questionsClone[action.payload.data.id] = {};
      }
      questionsClone[action.payload.data.id].surveillancePrograms = action.payload.data.surveillancePrograms;
      questionsClone[action.payload.data.id].surveillanceSystems = action.payload.data.surveillanceSystems;
      return questionsClone;
    case FETCH_QUESTION_PARENTS_FULFILLED:
      const questionsClone2 = Object.assign({}, state);
      if (questionsClone2[action.payload.data.id] === undefined) {
        questionsClone2[action.payload.data.id] = {};
      }
      questionsClone2[action.payload.data.id].parentItems = action.payload.data.parentItems;
      return questionsClone2;
    default:
      return state;
  }
}
