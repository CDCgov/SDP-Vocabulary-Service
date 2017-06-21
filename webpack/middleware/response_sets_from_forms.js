import {
  FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED,
  FETCH_FORM_FULFILLED,
} from '../actions/types';

import { dispatchIfNotPresent } from './store_helper';

const responseSetsFromForms = store => next => action => {
  switch (action.type) {
    case FETCH_FORM_FULFILLED:
      if(action.payload.data.responseSets){
        action.payload.data.responseSets.forEach((rs) => {
          dispatchIfNotPresent(store, 'responseSets', rs, FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED);
        });
        action.payload.data.responseSets = action.payload.data.responseSets.map((rs) => rs.id);
      }
  }

  next(action);
};

export default responseSetsFromForms;
