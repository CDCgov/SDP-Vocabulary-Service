import React from 'react';
import ReactDOM from 'react-dom';
import QuestionList from './components/QuestionList';
import Routes from "./routes";

const questions = JSON.parse(document.getElementById('question-json').innerHTML);
ReactDOM.render(<QuestionList questions={questions} routes={Routes} />, document.getElementById('question_list'));
