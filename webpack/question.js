import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CommentList from './containers/CommentList';


import configureStore from './store/configure_store';
import { addComment, fetchComments } from './actions/comment';

const store = configureStore();

exports.createCommentList =function(div, comments, type, id) {
  store.getState().comments=comments;
  ReactDOM.render(
    <Provider store={store}>
      <CommentList
                   comments={comments}
                   commentableType={type}
                   commentableId={id}
                   addComment={addComment}
                   fetchComments={fetchComments}/>
    </Provider>, document.getElementById(div));
};
