import { expect } from '../test_helper';
import forms from '../../../webpack/reducers/forms_reducer';
import _ from 'lodash';
import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED,
  ADD_QUESTION,
  REMOVE_QUESTION
} from '../../../webpack/actions/types';

describe('forms reducer', () => {
  const twoQuestions = [{id:1,content:"M?",questionTypeId:1},{id:2,content:"F?",questionTypeId:1}];
  const twoForms = [
                    {id: 1, name: "Red Form",  userId: "testAuthor@gmail.com", questions:[]},
                    {id: 3, name: "Blue Form", userId: "testAuthor@gmail.com", questions: twoQuestions}
                   ];

  it('should fetch forms', () => {
    const payloadData = {data: twoForms};
    const action = {type: FETCH_FORMS_FULFILLED, payload: payloadData};
    const startState = {}
    const nextState = forms(startState, action);
    expect(Object.keys(nextState).length).to.equal(2);
  });

  it('should add a question', () => {
    const form = {id: 1, name: "Red Form",  userId: "testAuthor@gmail.com", formQuestions:[]}
    const question = {id: 1, content: "Is this a question?", questionType: ""};
    const action = {type: ADD_QUESTION, payload: {question, form} };
    const startState = {};
    const nextState = forms(startState, action);
    expect(nextState["1"].formQuestions[0].questionId).to.equal(question.id);
  });

  it('should remove a question', () => {
    const question = {id: 1, content: "Is this a question?", questionType: ""};
    const form = {id: 1, name: "Red Form",  userId: "testAuthor@gmail.com", formQuestions:[question]};
    const action = {type: REMOVE_QUESTION, payload: {form, index: 0} };
    const startState = {1: form};
    const nextState = forms(startState, action);
    expect(nextState["1"].formQuestions.length).to.equal(0);
  });
});
