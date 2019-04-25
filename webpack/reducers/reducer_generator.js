import keyBy from 'lodash/keyBy';
import { ADD_ENTITIES_FULFILLED } from '../actions/types';

// Returns a reducer function. This function will listen for the passed in
// successType and it it finds it will return an object where the keys are the
// ids of objects in the payload and the value is the objects in the payload.
// It will expect payload.data to be an array of objects that all have an id
// property
export function byIdReducer(...successTypes) {
  return (state = {}, action) => {
    if (successTypes.includes(action.type)) {
      return keyBy(action.payload.data, 'id');
    } else {
      return state;
    }
  };
}

export function byIdReducerArray(...successTypes) {
  return (state = {}, action) => {
    if (successTypes.includes(action.type) && action.payload.data && action.payload.data.authors && action.payload.data.collabs) {
      let authors = keyBy(action.payload.data.authors, 'id');
      let collabs = keyBy(action.payload.data.collabs, 'id');
      let allTypes = {authors: authors, collabs: collabs}
      return allTypes;
    } else {
      return state;
    }
  };
}

// Same as byIdReducer but with a bit of added functionality. This reducer can
// also handle updates for an individual object. When the action is the
// individualSuccessType, the reducer will return a new state where object is
// inserted or replaced with what was provided in payload.data. This assumes
// that payload.data is a single object with and id property when action is
// individualSuccessType.
export function byIdWithIndividualReducer(batchSuccessType, individualSuccessType, type) {
  return (state = {}, action) => {
    switch (action.type) {
      case ADD_ENTITIES_FULFILLED:
        var newEntities = {};
        for (var id in action.payload[type]) {
          if (state[id] === undefined) {
            newEntities[id] = action.payload[type][id];
          }
        }
        return Object.assign({}, state, newEntities);
      case individualSuccessType:
        const stateClone = Object.assign({}, state);
        stateClone[action.payload.data.id] = action.payload.data;
        return stateClone;
      case batchSuccessType:
        return keyBy(action.payload.data, 'id');
      default:
        return state;
    }
  };
}
