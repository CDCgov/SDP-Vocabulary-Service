import assign from 'lodash/assign';

import * as helpers from './helpers';

import {
  SAVE_QUESTION_FULFILLED,
  RETIRE_QUESTION_FULFILLED,
  UPDATE_QUESTION_TAGS_FULFILLED,
  UPDATE_STAGE_QUESTION_FULFILLED,
  FETCH_QUESTION_USAGE_FULFILLED,
  DELETE_QUESTION_FULFILLED,
  ADD_ENTITIES_FULFILLED,
  ADD_ENTITIES_PENDING,
  ADD_ENTITIES_REJECTED,
  QUESTION_REQUEST,
  RESET_QUESTION_REQUEST,
  FETCH_QUESTION_SUCCESS,
  FETCH_QUESTION_FAILURE,
  ADD_QUESTION_TO_GROUP_FULFILLED,
  REMOVE_QUESTION_FROM_GROUP_FULFILLED
} from '../actions/types';

const defaultState = {
  isLoading : false,
  loadStatus : null
};

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
  let loadStatusText;
  switch (action.type) {
    case FETCH_QUESTION_SUCCESS:
      return Object.assign({}, state, action.payload.questions, { isLoading: false, loadStatus: 'success', loadStatusText : '' });
    case FETCH_QUESTION_FAILURE:
      loadStatusText = `An error occurred while trying to load this question: ${action.status} / ${action.statusText}`
      return Object.assign({},state,{
        isLoading: false,
        loadStatus : 'failure',
        loadStatusText
      });
    case QUESTION_REQUEST:
      return Object.assign({},state,{ isLoading: true, loadStatus: null, loadStatusText:'' });
    case RESET_QUESTION_REQUEST:
      return Object.assign({},state,{ isLoading: false, loadStatus: null, loadStatusText:""});
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
    default:
      return state;
  }
}
