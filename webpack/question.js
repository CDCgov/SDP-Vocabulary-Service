import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CommentList from './containers/CommentList';


import configureStore from './store/configure_store';
import { addComment, fetchComments } from './actions/comment';

const store = configureStore();

exports.createCommentList =function(div, comments, type, id) {
  ReactDOM.render(
    <Provider store={store}>
      <CommentList
                   commentable_type={type}
                   commentable_id={id}
                   addComment={addComment}
                   fetchComments={fetchComments}/>
    </Provider>, document.getElementById(div));
}
