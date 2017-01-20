import React from 'react';
import ReactDOM from 'react-dom';
import FormList from './components/FormList';
import Routes from './routes';
import _ from 'lodash';

const forms = JSON.parse(document.getElementById('forms-json').innerHTML);

forms.map((aForm) => {
  aForm.userId = aForm.createdBy.email;
});

ReactDOM.render(<FormList forms={_.keyBy(forms,'id')} routes={Routes} />, document.getElementById('form_list'));
