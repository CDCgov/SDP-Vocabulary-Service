import React from 'react';
import ReactDOM from 'react-dom';
import CommentList from './containers/CommentList';

exports.createCommentList =function(div, comments, type, id) {
  ReactDOM.render(<CommentList comments={comments} commentable_type={type} commentable_id={id} />, document.getElementById(div));
}
