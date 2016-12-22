import React from 'react';
import ReactDOM from 'react-dom';
import ResponseSetList from './components/ResponseSetList';
import Routes from "./routes";

const responseSets = JSON.parse(document.getElementById('response-set-json').innerHTML);
ReactDOM.render(<ResponseSetList responseSets={responseSets} routes={Routes} />, document.getElementById('response_set_list'));
