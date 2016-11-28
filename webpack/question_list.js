import React from 'react';
import ReactDOM from 'react-dom';
import QuestionList from './components/QuestionList';

const questions = JSON.parse(document.getElementById('question-json').innerHTML);
ReactDOM.render(<QuestionList questions={questions} />, document.getElementById('question_list'));
