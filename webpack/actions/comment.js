import axios from 'axios';
import routes from '../routes';
import {
  ADD_COMMENT,
  FETCH_COMMENTS
} from './types';

export function addComment(commentableType, commentableId, comment, parentId) {
  return {
    type: ADD_COMMENT,
    payload: axios.post(routes.comments_path(), {
      authenticity_token: getCSRFToken(),
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
    commentable_type: commentableType,
    commentableId: commentableId,
    payload: axios.get(routes.comments_path(), {
      params: {
        commentableType: commentableType,
        commentableId: commentableId,
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
