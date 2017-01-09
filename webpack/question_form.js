import React from 'react';
import ReactDOM from 'react-dom';
import Routes from "./routes";
import QuestionForm from './components/QuestionForm';
const question = JSON.parse(document.getElementById('question-json').innerHTML);
const concepts = JSON.parse(document.getElementById('concepts-json').innerHTML);
const responseSets  = JSON.parse(document.getElementById('response-sets-json').innerHTML);
const questionTypes = JSON.parse(document.getElementById('question-types-json').innerHTML);
const responseTypes = JSON.parse(document.getElementById('response-types-json').innerHTML);
const selectedResponseSets = JSON.parse(document.getElementById('question-response-sets-json').innerHTML);

ReactDOM.render(<QuestionForm question={question} selectedResponseSets={selectedResponseSets} responseSets={responseSets} questionTypes={questionTypes} responseTypes={responseTypes} routes={Routes} concepts={concepts}/>, document.getElementById('react-container'));
