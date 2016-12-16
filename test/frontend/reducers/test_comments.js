import { expect } from '../test_helper';
import  comments  from '../../../webpack/reducers/comments';

import {
  ADD_COMMENT,
  FETCH_COMMENTS,
  ADD_COMMENT_FULFILLED,
  FETCH_COMMENTS_FULFILLED
} from '../../../webpack/actions/types';

describe('comments reducer', () => {
  it('should add a comment', () => {
    const comment = {data: {comment: 'Is this a test?', commentable_id: 1, commentable_type: "Question"}}
    const action = {type: ADD_COMMENT_FULFILLED, payload: comment };
    const startState = [];
    const nextState = comments(startState, action);
    expect(nextState[0]).to.equal(comment.data);
  });

  it('should fetch comments', () => {
    const commentData = {data: [{comment: 'Is this a test?', commentable_id: 1, commentable_type: "Question"},
                      {comment: 'Yes it is!', commentable_id: 2, commentable_type: "Question"}]
                      } ;

    const action = {type: FETCH_COMMENTS_FULFILLED, payload: commentData};
    const startState = {comments: []}
    const nextState = comments(startState, action);
    expect(nextState.length).to.equal(2);
  });
});
