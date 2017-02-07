import axios from 'axios';
import routes from '../routes';
import { getCSRFToken } from './index';
import {
  ADD_COMMENT,
  FETCH_COMMENTS
} from './types';

export function addComment(commentableType, commentableId, comment, parentId) {
  return {
    type: ADD_COMMENT,
    payload: axios.post(routes.commentsPath(), {
      authenticityToken: getCSRFToken(),
      comment: {
        commentableType: commentableType,
        commentableId: commentableId,
        comment: comment,
        parentId: parentId
      }
    })
  };
}

export function fetchComments(commentableType, commentableId) {
  return {
    type: FETCH_COMMENTS,
    commentableType: commentableType,
    commentableId: commentableId,
    payload: axios.get(routes.comments_path(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: {
        commentable_type: commentableType,
        commentable_id: commentableId,
      }
    })
  };
}
