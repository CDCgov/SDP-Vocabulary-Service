import { expect } from '../test_helper';
import surveys from '../../../webpack/reducers/surveys_reducer';
import _ from 'lodash';
import {
  FETCH_SURVEY_FULFILLED,
  FETCH_SURVEYS_FULFILLED,
  ADD_FORM,
  REMOVE_FORM
} from '../../../webpack/actions/types';

describe('surveys reducer', () => {
  const twoForms   = [{id:1,name:"Form1"},{id:2,name:"Form2"}];
  const twoSurveys = [
                    {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", forms:[]},
                    {id: 3, name: "Blue Survey", userId: "testAuthor@gmail.com", forms: twoForms}
                    ];

  it('should fetch surveys', () => {
    const payloadData = {data: twoSurveys};
    const action = {type: FETCH_SURVEYS_FULFILLED, payload: payloadData};
    const startState = {}
    const nextState = surveys(startState, action);
    expect(Object.keys(nextState).length).to.equal(2);
  });

  it('should not overwrite surveys already in store', () => {
    const payloadData = {data: twoSurveys};
    const action = {type: FETCH_SURVEYS_FULFILLED, payload: payloadData};
    const preExistingSurvey = {id: 2, name:"Existing Survey", userId: "testAuthor@gmail.com", forms: []};
    const startState = {2: preExistingSurvey};
    const nextState = surveys(startState, action);
    expect(Object.keys(nextState).length).to.equal(3);
  });

  it('should add a form', () => {
    const survey = {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", surveyForms:[]}
    const form = {id: 1, content: "Is this a form?", formType: ""};
    const action = {type: ADD_FORM, payload: {survey, form} };
    const startState = {};
    const nextState = surveys(startState, action);
    expect(nextState["1"].surveyForms[0].formId).to.equal(form.id);
  });

  it('should not add the same form twice', () => {
    const survey = {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", surveyForms:[]}
    const form = {id: 1, content: "Is this a form?", formType: ""};
    const action = {type: ADD_FORM, payload: {survey, form} };
    const nextState  = surveys({}, action);
    const finalState = surveys(nextState, action);
    expect(finalState["1"].surveyForms.length).to.equal(1);
  });

  it('should remove a form', () => {
    const form = {id: 1, name: "Is this a form?"};
    const survey = {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", surveyForms:[form]};
    const action = {type: REMOVE_FORM, payload: {survey, index: 0} };
    const startState = {1: survey};
    const nextState = surveys(startState, action);
    expect(nextState["1"].surveyForms.length).to.equal(0);
  });
});
