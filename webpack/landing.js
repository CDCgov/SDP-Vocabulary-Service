require("styles/master.scss");
require("bootstrap-sass/assets/javascripts/bootstrap.js");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { hashHistory, Router, Route, IndexRoute } from 'react-router';

import DashboardContainer from './containers/DashboardContainer';
import ResponseSetShowContainer from './containers/ResponseSetShowContainer';
import FormShowContainer from './containers/FormShowContainer';
import QuestionShowContainer from './containers/QuestionShowContainer';
import ResponseSetEditContainer from './containers/ResponseSetEditContainer';
import QuestionEditContainer from './containers/QuestionEditContainer';
import SurveyEditContainer from './containers/SurveyEditContainer';
import FormsEditContainer from './containers/FormsEditContainer';
import SurveyShowContainer from './containers/surveys/ShowContainer';
import Privacy from './containers/Privacy';
import Help from './containers/Help';
import App from './containers/App';
import AuthenticatedRoutes from './containers/AuthenticatedRoutes';
import ErrorPage, {GenericError ,Forbidden403} from './containers/ErrorPages';


import store from './store/configure_store';
import {logPageViewed} from './utilities/AdobeAnalytics';
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory} onUpdate={logPageViewed}>
      <Route path='/' component={App}>
        <IndexRoute component={DashboardContainer} />
        <Route component={AuthenticatedRoutes}>
          <Route path='/forms/new' component={FormsEditContainer} />
          <Route path='/forms/:formId/:action' component={FormsEditContainer} />
          <Route path='/responseSets/new' component={ResponseSetEditContainer} />
          <Route path='/responseSets/:rsId/:action' component={ResponseSetEditContainer} />
          <Route path='/questions/new'  component={QuestionEditContainer} />
          <Route path='/questions/:qId/:action' component={QuestionEditContainer} />
          <Route path='/surveys/new'  component={SurveyEditContainer} />
          <Route path='/surveys/:surveyId/:action' component={SurveyEditContainer} />
        </Route>
        <Route path='/privacy' component={Privacy}/>
        <Route path='/help' component={Help}/>
        <Route path='/forms/:formId' component={FormShowContainer} />
        <Route path='/responseSets/:rsId' component={ResponseSetShowContainer} />
        <Route path='/questions/:qId' component={QuestionShowContainer} />
        <Route path='/surveys/:surveyId' component={SurveyShowContainer} />
        <Route path='/errors/' component={ErrorPage} >
          <Route path='403' component={Forbidden403} />
          <Route path='*' component={GenericError} />
        </Route>
      </Route>
    </Router>
  </Provider>, document.getElementById("app"));
