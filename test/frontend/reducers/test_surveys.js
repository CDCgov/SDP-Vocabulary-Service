import { normalize } from 'normalizr';
import { expect } from '../test_helper';
import surveys from '../../../webpack/reducers/surveys_reducer';
import { surveysSchema } from '../../../webpack/schema';
import {
  ADD_ENTITIES_FULFILLED,
  DELETE_SURVEY_FULFILLED,
  ADD_SECTION,
  REMOVE_SECTION
} from '../../../webpack/actions/types';

describe('surveys reducer', () => {
  const twoSections   = [{id:1,name:"Section1"},{id:2,name:"Section2"}];
  const twoSurveys = [
                    {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", sections:[]},
                    {id: 3, name: "Blue Survey", userId: "testAuthor@gmail.com", sections: twoSections}
  ];

  it('should fetch surveys', () => {
    const payloadData = normalize(twoSurveys, surveysSchema).entities;
    const action = {type: ADD_ENTITIES_FULFILLED, payload: payloadData};
    const startState = {};
    const nextState = surveys(startState, action);
    expect(Object.keys(nextState).length).to.equal(2);
  });

  it('should add a section', () => {
    const survey = {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", surveySections:[]};
    const section = {id: 1, content: "Is this a section?", sectionType: ""};
    const action = {type: ADD_SECTION, payload: {survey, section} };
    const startState = {};
    const nextState = surveys(startState, action);
    expect(nextState["1"].surveySections[0].sectionId).to.equal(section.id);
  });

  it('should not add the same section twice', () => {
    const survey = {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", surveySections:[]};
    const section = {id: 1, content: "Is this a section?", sectionType: ""};
    const action = {type: ADD_SECTION, payload: {survey, section} };
    const nextState  = surveys({}, action);
    const finalState = surveys(nextState, action);
    expect(finalState["1"].surveySections.length).to.equal(1);
  });

  it('should remove a section', () => {
    const section = {id: 1, name: "Is this a section?"};
    const survey = {id: 1, name: "Red Survey",  userId: "testAuthor@gmail.com", surveySections:[section]};
    const action = {type: REMOVE_SECTION, payload: {survey, index: 0} };
    const startState = {1: survey};
    const nextState = surveys(startState, action);
    expect(nextState["1"].surveySections.length).to.equal(0);
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
