import axios from 'axios';
import routes from '../routes';
import {
  ADD_COMMENT,
  FETCH_COMMENTS
} from './types';

export function addComment(commentable_type, commentable_id, comment, parent_id) {
  return {
    type: ADD_COMMENT,
    payload: axios.post(routes.comments_path(), {
      authenticity_token: getCSRFToken(),
      comment: {
        commentable_type: commentable_type,
        commentable_id: commentable_id,
        comment: comment,
        parent_id: parent_id
      }
    })
  };
}



export function fetchComments(commentable_type, commentable_id) {
  return {
    type: FETCH_COMMENTS,
    commentable_type: commentable_type,
    commentable_id: commentable_id,
    payload: axios.get(routes.comments_path(), {
      params: {
        commentable_type: commentable_type,
        commentable_id: commentable_id,
      }
    })
  };
}


function getCSRFToken() {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];
    if (meta.getAttribute('name') === 'csrf-token') {
      return meta.getAttribute('content');
    }
  }

  return null;
}
