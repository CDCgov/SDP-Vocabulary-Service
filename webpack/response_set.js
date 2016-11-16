import React from 'react';
import ReactDOM from 'react-dom';
import ResponseSetTable from './components/ResponseSetTable';

const responses = JSON.parse(document.getElementById('responses-json').innerHTML);
ReactDOM.render(<ResponseSetTable initialResponses={responses} />, document.getElementById('response-set-table'));
