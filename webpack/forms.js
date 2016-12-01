import React from 'react';
import ReactDOM from 'react-dom';

import AddedFormQuestionList from './components/AddedFormQuestionList';
import QuestionList from './components/QuestionList';

import { observe } from './FormBuild';

const unadded = document.getElementById('search-results-div');
const added   = document.getElementById('added-questions');

const all_qs = JSON.parse(document.getElementById('all_qs-json').innerHTML);
const form_qs = JSON.parse(document.getElementById('formqs-json').innerHTML);
const all_rs = JSON.parse(document.getElementById('all_rs-json').innerHTML);

ReactDOM.render(<QuestionList questions={all_qs} response_sets={all_rs} />, unadded );

observe(questions => 
  ReactDOM.render(
    <AddedFormQuestionList questions={questions} response_sets={all_rs} />,
    added 
  )
);
