import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configure_store';
import QuestionListContainer from './containers/QuestionListContainer';

const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <QuestionListContainer />
  </Provider>
  ,document.getElementById('question_list'));
