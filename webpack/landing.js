require("styles/master.scss");
require("bootstrap-sass/assets/javascripts/bootstrap.js");
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { hashHistory, Router, Route, IndexRoute } from 'react-router';

import DashboardContainer from './containers/DashboardContainer';
import ResponseSetShowContainer from './containers/response_sets/ResponseSetShowContainer';
import SectionShowContainer from './containers/sections/SectionShowContainer';
import QuestionShowContainer from './containers/questions/QuestionShowContainer';
import ResponseSetEditContainer from './containers/response_sets/ResponseSetEditContainer';
import QuestionEditContainer from './containers/questions/QuestionEditContainer';
import SurveyEditContainer from './containers/surveys/SurveyEditContainer';
import SurveyImportContainer from './containers/surveys/SurveyImportContainer';
import SurveyDedupeContainer from './containers/surveys/SurveyDedupeContainer';
import SectionEditContainer from './containers/sections/SectionEditContainer';
import SurveyShowContainer from './containers/surveys/SurveyShowContainer';
import TermsOfService from './containers/TermsOfService';
import Help from './containers/Help';
import FHIRDoc from './components/FHIRDoc';
import AdminPanel from './containers/AdminPanel';
import App from './containers/App';
import AuthenticatedRoutes from './containers/AuthenticatedRoutes';
import AdminRoutes from './containers/AdminRoutes';
import ErrorPage, {GenericError, Forbidden403, NotFound404} from './containers/ErrorPages';


import store from './store/configure_store';
import {logPageViewed} from './utilities/AdobeAnalytics';
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory} onUpdate={logPageViewed}>
      <Route path='/' component={App}>
        <IndexRoute component={DashboardContainer} />
        <Route component={AdminRoutes}>
          <Route path='/admin' component={AdminPanel} />
        </Route>
        <Route component={AuthenticatedRoutes}>
          <Route path='/sections/new' component={SectionEditContainer} />
          <Route path='/sections/:sectionId/:action' component={SectionEditContainer} />
          <Route path='/responseSets/new' component={ResponseSetEditContainer} />
          <Route path='/responseSets/:rsId/:action' component={ResponseSetEditContainer} />
          <Route path='/questions/new'  component={QuestionEditContainer} />
          <Route path='/questions/:qId/:action' component={QuestionEditContainer} />
          <Route path='/surveys/new'  component={SurveyEditContainer} />
          <Route path='/surveys/import' component={SurveyImportContainer} />
          <Route path='/surveys/:surveyId/dedupe' component={SurveyDedupeContainer} />
          <Route path='/surveys/:surveyId/:action' component={SurveyEditContainer} />
        </Route>
        <Route path='/termsOfService' component={TermsOfService}/>
        <Route path='/help' component={Help}/>
        <Route path='/fhirDoc' component={FHIRDoc}/>
        <Route path='/sections/:sectionId' component={SectionShowContainer} />
        <Route path='/responseSets/:rsId' component={ResponseSetShowContainer} />
        <Route path='/questions/:qId' component={QuestionShowContainer} />
        <Route path='/surveys/:surveyId' component={SurveyShowContainer} />
        <Route path='/errors/' component={ErrorPage} >
          <Route path='403' component={Forbidden403} />
          <Route path='404' component={NotFound404} />
          <Route path='*' component={GenericError} />
        </Route>
      </Route>
    </Router>
  </Provider>, document.getElementById("app"));
