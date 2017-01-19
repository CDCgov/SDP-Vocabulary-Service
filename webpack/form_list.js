import React from 'react';
import ReactDOM from 'react-dom';
import FormList from './components/FormList';
import Routes from './routes';

const forms = JSON.parse(document.getElementById('forms-json').innerHTML);

forms.map((aForm) => {
  aForm.userId = aForm.createdBy.email;
});

ReactDOM.render(<FormList forms={forms} routes={Routes} />, document.getElementById('form_list'));
