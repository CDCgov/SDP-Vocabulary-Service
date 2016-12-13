import React from 'react';
import ReactDOM from 'react-dom';
import SearchWidget from './components/SearchWidget';
import Routes from "./routes";

const questions = JSON.parse(document.getElementById('question-json').innerHTML);
const response_sets = JSON.parse(document.getElementById('response-set-json').innerHTML);
ReactDOM.render(<SearchWidget questions={questions} response_sets={response_sets} routes={Routes} />, document.getElementById('search_widget'));
