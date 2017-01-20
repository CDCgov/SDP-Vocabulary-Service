import React from 'react';
import ReactDOM from 'react-dom';
import ResponseSetList from './components/ResponseSetList';
import Routes from "./routes";

import _ from 'lodash';

const responseSets = JSON.parse(document.getElementById('response-set-json').innerHTML);
ReactDOM.render(<ResponseSetList responseSets={_.keyBy(responseSets, 'id')} routes={Routes} />, document.getElementById('response_set_list'));
