import { normalize } from 'normalizr';
import { expect } from '../test_helper';
import surveys from '../../../webpack/reducers/surveys_reducer';
import { surveysSchema } from '../../../webpack/schema';
import {
  ADD_ENTITIES_FULFILLED,
  DELETE_SURVEY_FULFILLED,
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
    const payloadData = normalize(twoSurveys, surveysSchema).entities;
    const action = {type: ADD_ENTITIES_FULFILLED, payload: payloadData};
    const startState = {};
    const nextState = surveys(startState, action);
    expect(Object.keys(nextState).length).to.equal(2);
  });

  it('should add a form', () => {
    const survey = {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", surveyForms:[]};
    const form = {id: 1, content: "Is this a form?", formType: ""};
    const action = {type: ADD_FORM, payload: {survey, form} };
    const startState = {};
    const nextState = surveys(startState, action);
    expect(nextState["1"].surveyForms[0].formId).to.equal(form.id);
  });

  it('should not add the same form twice', () => {
    const survey = {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", surveyForms:[]};
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

  it('should delete a survey', () => {
    const action = {type: DELETE_SURVEY_FULFILLED, payload: {data: {id: 1}}};
    const startState = {1: {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com"},
      2: {id: 2, name: "Blue Survey",  userId: "testAuthor@gmail.com"}};
    const nextState = surveys(startState, action);
    expect(nextState["1"]).to.be.undefined;
    expect(nextState["2"].name).to.equal("Blue Survey");
  });
});
