import React from 'react';
import ReactDOM from 'react-dom';
import SearchWidget from './components/SearchWidget';
import Routes from "./routes";

const questions = JSON.parse(document.getElementById('question-json').innerHTML);
const responseSets = JSON.parse(document.getElementById('response-set-json').innerHTML);
ReactDOM.render(<SearchWidget questions={questions} responseSets={responseSets} routes={Routes} />, document.getElementById('search-widget'));
