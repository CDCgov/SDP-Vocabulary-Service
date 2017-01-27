import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configure_store';
import CommentList from './containers/CommentList';
import QuestionShowContainer from './containers/QuestionShowContainer';

const store = configureStore();

exports.createQuestionShowPage = function(questionId) {
  ReactDOM.render(
    <Provider store={store}>
      <QuestionShowContainer questionId={questionId}/>
    </Provider>, document.getElementById('question_details'));
  ReactDOM.render(
    <Provider store={store}>
      <CommentList commentableType='Question' commentableId={questionId}/>
    </Provider>, document.getElementById('comments'));
};