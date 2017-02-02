import _ from 'lodash';

import {
  FETCH_QUESTION_TYPE_FULFILLED,
  FETCH_QUESTION_TYPES_FULFILLED,
} from '../actions/types';

export default function questionTypes(state = {}, action) {
  switch (action.type) {
    case FETCH_QUESTION_TYPE_FULFILLED:
      const questionTypeClone = Object.assign({}, state);
      questionTypeClone[action.payload.data.id] = action.payload.data;
      return questionTypeClone;
    case FETCH_QUESTION_TYPES_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    default:
      return state;
  }
}
