import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED
} from '../actions/types';

import dispatchIfNotPresent from './store_helper';

const parentFromResponseSets = store => next => action => {
  if (store == null) return;
  switch (action.type) {
    case FETCH_RESPONSE_SETS_FULFILLED:
      const responseSets = action.payload.data;
      responseSets.forEach((rs) => {
        if (rs.parent) {
          dispatchIfNotPresent(store, 'responseSets', rs.parent, FETCH_RESPONSE_SET_FULFILLED);
          rs.parent = ({id: rs.parent.id, name: rs.parent.name});
        }
      });
      break;
    case FETCH_RESPONSE_SET_FULFILLED:
      if(action.payload.data.parent){
        dispatchIfNotPresent(store, 'responseSets', action.payload.data.parent, FETCH_RESPONSE_SET_FULFILLED);
        action.payload.data.parent = ({id: action.payload.data.parent.id, name: action.payload.data.parent.name});
      }
  }

  next(action);
};

export default parentFromResponseSets;
