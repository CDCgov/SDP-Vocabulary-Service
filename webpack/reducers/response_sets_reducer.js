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
  FETCH_MORE_RESPONSES_FULFILLED
} from '../actions/types';

import cloneDeep from 'lodash/cloneDeep';

export default function responseSets(state = {}, action) {
  let responseSetClone;
  switch (action.type) {
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.responseSets);
    case ADD_ENTITIES_REJECTED:
      return Object.assign({},state);
    case ADD_ENTITIES_PENDING:
      return Object.assign({},state);
    case FETCH_MORE_RESPONSES_FULFILLED:
      const newStateClone = cloneDeep(state);
      const rs = newStateClone[action.payload.data.id];
      rs.responses = rs.responses.concat(action.payload.data.responses);
      return newStateClone;
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
