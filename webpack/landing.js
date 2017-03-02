require("styles/master.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { hashHistory, Router, Route, IndexRoute } from 'react-router';

import DashboardContainer from './containers/DashboardContainer';
import FormsIndexContainer from './containers/FormsIndexContainer';
import ResponseSetsContainer from './containers/ResponseSetsContainer';
import QuestionIndexContainer from './containers/QuestionIndexContainer';
import ResponseSetShowContainer from './containers/ResponseSetShowContainer';
import FormShowContainer from './containers/FormShowContainer';
import QuestionShowContainer from './containers/QuestionShowContainer';
import ResponseSetEditContainer from './containers/ResponseSetEditContainer';
import QuestionEditContainer from './containers/QuestionEditContainer';
import FormsEditContainer from './containers/FormsEditContainer';
import MyStuffContainer from './containers/MyStuffContainer';
import Privacy from './containers/Privacy';
import App from './containers/App';

import configureStore from './store/configure_store';

const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={DashboardContainer} />
        <Route path='/mystuff' component={MyStuffContainer} />
        <Route path='/privacy' component={Privacy}/>
        <Route path='/forms' component={FormsIndexContainer} />
          <Route path='/forms/new' component={FormsEditContainer} />
          <Route path='/forms/:formId' component={FormShowContainer} />
          <Route path='/forms/:formId/:action' component={FormsEditContainer} />
        <Route path='/responseSets' component={ResponseSetsContainer} />
          <Route path='/responseSets/new' component={ResponseSetEditContainer} />
          <Route path='/responseSets/:rsId' component={ResponseSetShowContainer} />
          <Route path='/responseSets/:rsId/:action' component={ResponseSetEditContainer} />
        <Route path='/questions' component={QuestionIndexContainer} />
          <Route path='/questions/new' component={QuestionEditContainer} />
          <Route path='/questions/:qId' component={QuestionShowContainer} />
          <Route path='/questions/:qId/:action' component={QuestionEditContainer} />
      </Route>
    </Router>
  </Provider>, document.getElementById("app"));
