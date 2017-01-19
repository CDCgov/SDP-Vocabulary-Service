import React from 'react';
import ReactDOM from 'react-dom';
import SearchWidget from './components/SearchWidget';
import Routes from "./routes";
import _ from 'lodash';

const questions = _.keyBy(JSON.parse(document.getElementById('question-json').innerHTML), 'id');
const responseSets = JSON.parse(document.getElementById('response-set-json').innerHTML);
ReactDOM.render(<SearchWidget questions={questions} responseSets={responseSets} routes={Routes} />, document.getElementById('search-widget'));
