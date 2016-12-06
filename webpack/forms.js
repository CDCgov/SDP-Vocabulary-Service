import React from 'react';
import ReactDOM from 'react-dom';

import FormsQuestionList from './components/FormsQuestionList';
import QuestionSearch from './components/QuestionSearch';

import { observe } from './FormBuild';

const added   = document.getElementById('added-questions');
const allQs = JSON.parse(document.getElementById('all_qs-json').innerHTML);
const allRs = JSON.parse(document.getElementById('all_rs-json').innerHTML);

ReactDOM.render(<QuestionSearch allQs={allQs} allRs={allRs} />, document.getElementById('search-results-div'));

observe(questions => 
  ReactDOM.render(
    <FormsQuestionList questions={questions} responseSets={allRs} btnType={'remove'} />,
    added 
  )
);
