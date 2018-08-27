import * as helpers from './helpers';

import {
  FETCH_RESPONSE_SET_USAGE_FULFILLED,
  SAVE_RESPONSE_SET_FULFILLED,
  SAVE_DRAFT_RESPONSE_SET_FULFILLED,
  PUBLISH_RESPONSE_SET_FULFILLED,
  RETIRE_RESPONSE_SET_FULFILLED,
  ADD_ENTITIES_FULFILLED,
  ADD_ENTITIES_PENDING,
  ADD_ENTITIES_REJECTED,
  ADD_RESPONSE_SET_TO_GROUP_FULFILLED,
  UPDATE_STAGE_RESPONSE_SET_FULFILLED,
  REMOVE_RESPONSE_SET_FROM_GROUP_FULFILLED,
  FETCH_RESPONSE_SET_SUCCESS,
  FETCH_RESPONSE_SET_FAILURE
} from '../actions/types';

export default function responseSets(state = {}, action) {
  let responseSetClone, loadStatusText;
  switch (action.type) {
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.responseSets);
    case ADD_ENTITIES_REJECTED:
      return Object.assign({},state);
    case ADD_ENTITIES_PENDING:
      return Object.assign({},state);
    case SAVE_DRAFT_RESPONSE_SET_FULFILLED:
    case PUBLISH_RESPONSE_SET_FULFILLED:
    case RETIRE_RESPONSE_SET_FULFILLED:
    case UPDATE_STAGE_RESPONSE_SET_FULFILLED:
    case SAVE_RESPONSE_SET_FULFILLED:
    case ADD_RESPONSE_SET_TO_GROUP_FULFILLED:
    case REMOVE_RESPONSE_SET_FROM_GROUP_FULFILLED:
      return helpers.fetchIndividual(state, action);
    case FETCH_RESPONSE_SET_USAGE_FULFILLED:
      responseSetClone = Object.assign({}, state);
      if (responseSetClone[action.payload.data.id] === undefined) {
        responseSetClone[action.payload.data.id] = {};
      }
      responseSetClone[action.payload.data.id].surveillancePrograms = action.payload.data.surveillancePrograms;
      responseSetClone[action.payload.data.id].surveillanceSystems = action.payload.data.surveillanceSystems;
      return responseSetClone;
    default:
      return state;
  }
}
