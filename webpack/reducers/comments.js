import {
  ADD_COMMENT,
  ADD_COMMENT_FULFILLED,
  FETCH_COMMENTS,
  FETCH_COMMENTS_FULFILLED,
  REPLY_TO_COMMENT,
  REPLY_TO_COMMENT_FULFILLED
} from '../actions/types';


export default function comments(state = {comments: [], loading: false}, action) {
  switch (action.type) {
    case FETCH_COMMENTS:
      return Object.assign({}, state, {
        loading: true,
        fetchy: true
      })
    case FETCH_COMMENTS_FULFILLED:
      return Object.assign({}, state, {
        loading: false,
        comments: [...action.payload.data]
      })
    case ADD_COMMENT_FULFILLED:
      return Object.assign({}, state, {
        comments:[...state.comments, action.payload.data],
      })
    case REPLY_TO_COMMENT_FULFILLED:
      return Object.assign({}, state, {
        comments:[...state.comments, action.payload.data],
      })
    default:
      return state
  }
}
