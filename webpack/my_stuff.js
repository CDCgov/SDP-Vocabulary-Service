import React from 'react';
import ReactDOM from 'react-dom';
import FormList from './components/FormList';
import ResponseSetList from './components/ResponseSetList';
import QuestionList from './components/QuestionList';
import Routes from './routes';

import _ from 'lodash';

const forms = JSON.parse(document.getElementById('forms-json').innerHTML);
const questions = JSON.parse(document.getElementById('question-json').innerHTML);
const responseSets = JSON.parse(document.getElementById('response-set-json').innerHTML);

forms.map((aForm) => {
  aForm.userId = aForm.createdBy.email;
});

ReactDOM.render(<FormList forms={_.keyBy(forms,'id')} routes={Routes} />, document.getElementById('form_list'));
ReactDOM.render(<QuestionList questions={questions} routes={Routes} />, document.getElementById('question_list'));
ReactDOM.render(<ResponseSetList responseSets={_.keyBy(responseSets, 'id')} routes={Routes} />, document.getElementById('response_set_list'));
