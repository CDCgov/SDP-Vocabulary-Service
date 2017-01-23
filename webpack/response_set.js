import React from 'react';
import ReactDOM from 'react-dom';
import CodedSetTableForm from './components/CodedSetTableForm';

const responses = JSON.parse(document.getElementById('responses-json').innerHTML);
ReactDOM.render(<CodedSetTableForm initialItems={responses} parentName={'response_set'} childName={'response'} />, document.getElementById('response-set-table'));
