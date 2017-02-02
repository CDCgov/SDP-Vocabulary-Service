import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED
} from '../actions/types';

const parentFromResponseSets = store => next => action => {
  switch (action.type) {
    case FETCH_RESPONSE_SETS_FULFILLED:
      const responseSets = action.payload.data;
      responseSets.forEach((rs) => {
        if(rs.parent){
          store.dispatch({type: FETCH_RESPONSE_SET_FULFILLED, payload: {data: rs.parent}});
          rs.parent = ({id: rs.parent.id, name: rs.parent.name});
        }
      });
      break;
    case FETCH_RESPONSE_SET_FULFILLED:
      if(action.payload.data.parent){
        store.dispatch({type: FETCH_RESPONSE_SET_FULFILLED, payload: {data: action.payload.data.parent}});
        action.payload.data.parent = ({id: action.payload.data.parent.id, name: action.payload.data.parent.name});
        //action.payload.data.parent = Object.keys(action.payload.data.parent).reduce((id, name) => {return({id: id, name: name});});
      }
  }

  next(action);
};

export default parentFromResponseSets;
