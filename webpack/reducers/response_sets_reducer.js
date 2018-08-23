import * as helpers from './helpers';

import {
  FETCH_RESPONSE_SET_USAGE_FULFILLED,
  SAVE_RESPONSE_SET_FULFILLED,
  SAVE_DRAFT_RESPONSE_SET_FULFILLED,
  PUBLISH_RESPONSE_SET_FULFILLED,
  RETIRE_RESPONSE_SET_FULFILLED,
  ADD_ENTITIES_FULFILLED,
  ADD_RESPONSE_SET_TO_GROUP_FULFILLED,
  UPDATE_STAGE_RESPONSE_SET_FULFILLED,
  REMOVE_RESPONSE_SET_FROM_GROUP_FULFILLED,
  RESPONSE_SET_REQUEST,
  RESET_RESPONSE_SET_REQUEST,
  FETCH_RESPONSE_SET_SUCCESS,
  FETCH_RESPONSE_SET_FAILURE
} from '../actions/types';

export default function responseSets(state = {}, action) {
  let responseSetClone, loadStatusText;
  switch (action.type) {
    case FETCH_RESPONSE_SET_SUCCESS:
      return Object.assign({}, state, action.payload.responseSets, { isLoading: false, loadStatus: 'success', loadStatusText : '' });
    case FETCH_RESPONSE_SET_FAILURE:
      loadStatusText = `An error occurred while trying to load this response set: ${action.status} / ${action.statusText}`
      return Object.assign({},state,{
        isLoading: false,
        loadStatus : 'failure',
        loadStatusText
      });
    case RESPONSE_SET_REQUEST:
      return Object.assign({},state,{ isLoading: true, loadStatus: null, loadStatusText:'' });
    case RESET_RESPONSE_SET_REQUEST:
      return Object.assign({},state,{ isLoading: false, loadStatus: null, loadStatusText:''});
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.responseSets);
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
