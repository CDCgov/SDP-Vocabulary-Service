import React from 'react';
import ReactDOM from 'react-dom';
import FormList from './components/FormList';
import ResponseSetList from './components/ResponseSetList';
import QuestionList from './components/QuestionList';
import Routes from './routes';

const forms = JSON.parse(document.getElementById('forms-json').innerHTML);
const questions = JSON.parse(document.getElementById('question-json').innerHTML);
const responseSets = JSON.parse(document.getElementById('response-set-json').innerHTML);

ReactDOM.render(<FormList forms={forms} routes={Routes} />, document.getElementById('form_list'));
ReactDOM.render(<QuestionList questions={questions} routes={Routes} />, document.getElementById('question_list'));
ReactDOM.render(<ResponseSetList responseSets={responseSets} routes={Routes} />, document.getElementById('response_set_list'));
