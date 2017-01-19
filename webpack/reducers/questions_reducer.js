import _ from 'lodash';
import {
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  FETCH_QUESTIONS_FULFILLED
} from '../actions/types';

export default function questions(state = {}, action) {
  switch (action.type) {
    case ADD_QUESTION:
      var newQuestion = {};
      newQuestion[action.payload.data.id] = action.payload.data;
      return _.merge(state, newQuestion);
    case REMOVE_QUESTION:
      return _.omitBy(state,(v, k)=>{
        return action.payload!=k;
      });
    case REORDER_QUESTION:
      return state;
    case FETCH_QUESTIONS_FULFILLED:
      return _.keyBy(action.payload.data,'id');
    default:
      return state;
  }
}
