import React from 'react';
import ReactDOM from 'react-dom';
import CommentList from './components/CommentList';

exports.createCommentList =function(div, comments, type, id) {
  ReactDOM.render(<CommentList comments={comments} commentable_type={type} commentable_id={id} />, document.getElementById(div));
}
