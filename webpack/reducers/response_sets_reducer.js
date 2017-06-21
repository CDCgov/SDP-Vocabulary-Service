import keyBy from 'lodash/keyBy';
import assign from 'lodash/assign';

import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED,
  FETCH_RESPONSE_SET_USAGE_FULFILLED,
  SAVE_RESPONSE_SET_FULFILLED,
  SAVE_DRAFT_RESPONSE_SET_FULFILLED,
  PUBLISH_RESPONSE_SET_FULFILLED,
  FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED
} from '../actions/types';

export default function responseSets(state = {}, action) {
  let responseSetClone;
  switch (action.type) {
    case FETCH_RESPONSE_SETS_FULFILLED:
      responseSetClone = Object.assign({}, state);
      return assign(responseSetClone, keyBy(action.payload.data, 'id'));
    case FETCH_RESPONSE_SET_FULFILLED:
    case SAVE_DRAFT_RESPONSE_SET_FULFILLED:
    case PUBLISH_RESPONSE_SET_FULFILLED:
    case SAVE_RESPONSE_SET_FULFILLED:
      responseSetClone = Object.assign({}, state);
      const id = action.payload.data.id;
      const existingRs = responseSetClone[action.payload.data.id];
      if (existingRs) {
        responseSetClone[id] = assign(existingRs, action.payload.data);
      } else {
        responseSetClone[id] = action.payload.data;
      }
      return responseSetClone;
    case FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED:
      responseSetClone = Object.assign({}, state);
      const rsId = action.payload.data.id;
      const existRs = responseSetClone[rsId];
      if (existRs) {
        responseSetClone[rsId] = assign(existRs, action.payload.data);
      } else {
        responseSetClone[rsId] = action.payload.data;
      }
      responseSetClone[rsId]['fromMiddleware'] = true;
      return responseSetClone;
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
