import React from 'react';
import ReactDOM from 'react-dom';
import FormList from './components/FormList';
import Routes from './routes';
import { camelCase } from './camelcase';

const forms = JSON.parse(document.getElementById('forms-json').innerHTML);
const authors = JSON.parse(document.getElementById('authors-json').innerHTML);

forms.forEach((form) => {
  Object.keys(form).forEach((k) => {
    if (k.includes('_')) {
      form[camelCase(k)] = form[k];
      delete form[k];
    }
  });
  authors.forEach((a) => {
    if (a['id'] == form['createdById']) {
      form['createdByEmail'] = a['email'];
    }
  });
});
ReactDOM.render(<FormList forms={forms} routes={Routes} />, document.getElementById('form_list'));
