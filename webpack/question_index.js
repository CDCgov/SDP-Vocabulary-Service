import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configure_store';
import QuestionIndexContainer from './containers/QuestionIndexContainer';

const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <QuestionIndexContainer />
  </Provider>
  ,document.getElementById('question_list'));
