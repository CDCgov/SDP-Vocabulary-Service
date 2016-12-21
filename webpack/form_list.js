import React from 'react';
import ReactDOM from 'react-dom';
import FormList from './components/FormList';
import Routes from './routes';

const forms = JSON.parse(document.getElementById('forms-json').innerHTML);
ReactDOM.render(<FormList forms={forms} routes={Routes} />, document.getElementById('form_list'));