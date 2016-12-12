import {
  ADD_COMMENT,
  REPLY_TO_COMMENT
} from './types';

export function submitCommentForm(data){
    console.log(data)
    return false
}

export function addComment(comment) {
  return {
    type: ADD_COMMENT,
    payload: comment
  };
}

export function removeQuestion(comment) {
  return {
    type: REPLY_TO_COMMENT,
    payload: comment
  };
}
