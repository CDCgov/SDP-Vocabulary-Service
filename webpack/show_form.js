import React from 'react';
import ReactDOM from 'react-dom';
import FormShow from './components/FormShow';
import Routes from './routes';

const TBD = {
"id":1,
"name":"Bloop",
"createdById":1,
"createdAt":"2016-12-27T23:40:54.505Z",
"updatedAt":"2016-12-27T23:40:54.505Z",
"versionIndependentId":"F-1",
"version":1,
"controlNumber":"",
"oid":null,
"questions":[],
"userId":"testAuthor@gmail.com"
}

ReactDOM.render(
<FormShow form={TBD} routes={Routes} />,
document.getElementById('-form')
);

console.log(Routes);
