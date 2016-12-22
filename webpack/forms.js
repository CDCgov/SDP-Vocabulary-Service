import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import FormsQuestionList from './containers/FormsQuestionList';
import QuestionSearch from './containers/QuestionSearch';

import configureStore from './store/configure_store';
import { addQuestion } from './actions/question';


const store = configureStore();

const added   = document.getElementById('added-questions');
const allQs = JSON.parse(document.getElementById('all_qs-json').innerHTML);
const allRs = JSON.parse(document.getElementById('all_rs-json').innerHTML);
const selectedQsScript = document.getElementById('formqs-json');

const selectedQs = JSON.parse(selectedQsScript.innerHTML);
if (selectedQs) {
  selectedQs.forEach((q) => store.dispatch(addQuestion(q)));
}

ReactDOM.render(<Provider store={store}>
    <QuestionSearch allQs={allQs} allRs={allRs} />
  </Provider>, document.getElementById('search-results-div'));


ReactDOM.render(
  <Provider store={store}>
    <FormsQuestionList responseSets={allRs} />
  </Provider>,
  added
);
