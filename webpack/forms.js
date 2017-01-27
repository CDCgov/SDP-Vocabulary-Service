import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import $ from 'jquery';
import FormsQuestionList from './containers/FormsQuestionList';
import QuestionSearchContainer from './containers/QuestionSearchContainer';

import configureStore from './store/configure_store';
import { addQuestion } from './actions/questions_actions';


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
    <QuestionSearchContainer allQs={allQs} allRs={allRs} />
  </Provider>, document.getElementById('search-results-div'));


ReactDOM.render(
  <Provider store={store}>
    <FormsQuestionList responseSets={allRs} />
  </Provider>,
  added
);

$('#new_form').submit((event) => {
  event.preventDefault();
  const submissionURL = event.target.action;
  const formData = $(event.target).serialize();
  const request = $.post(submissionURL, formData, null, 'json');
  request.done((data) => {
    const location = data.url.replace('.json', '');
    window.location = location;
  });
  request.fail((jqXHR) => {
    const errorItems = jqXHR.responseJSON.map((e) => `<li>${e}</li>`);
    $('#error_explanation').html(`
      <h2>${jqXHR.responseJSON.length} error(s) prohibited this form from being saved:</h2>
      <ul>
        ${errorItems}
      </ul>
    `);
  });
  return false;
});
