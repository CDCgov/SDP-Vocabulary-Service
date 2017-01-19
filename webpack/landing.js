import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { hashHistory, Router, Route, IndexRoute } from 'react-router';

import DashboardContainer from './containers/DashboardContainer';
import FormsContainer from './containers/FormsContainer';
import ResponseSetsContainer from './containers/ResponseSetsContainer';
import QuestionsContainer from './containers/QuestionsContainer';
import App from './containers/App';

import configureStore from './store/configure_store';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={DashboardContainer} />
        <Route path='/forms' component={FormsContainer} />
        <Route path='/responseSets' component={ResponseSetsContainer} />
        <Route path='/questions' component={QuestionsContainer} />
      </Route>
    </Router>
  </Provider>, document.getElementById("app"));
