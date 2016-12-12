import React from 'react';
import ReactDOM from 'react-dom';
import ResponseSetList from './components/ResponseSetList';
import Routes from "./routes";

const response_sets = JSON.parse(document.getElementById('response-set-json').innerHTML);
ReactDOM.render(<ResponseSetList response_sets={response_sets} routes={Routes} />, document.getElementById('response_set_list'));
