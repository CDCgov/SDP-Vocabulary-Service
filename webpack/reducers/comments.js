import {

  ADD_COMMENT_FULFILLED,
  FETCH_COMMENTS_FULFILLED
} from '../actions/types';


export default function comments(state = [], action) {
  switch (action.type) {
    case FETCH_COMMENTS_FULFILLED:
      return [...action.payload.data];
    case ADD_COMMENT_FULFILLED:
      return [...state, action.payload.data];
    default:
      return state;
  }
}
