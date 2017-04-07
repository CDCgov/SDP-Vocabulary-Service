import { expect } from '../test_helper';
import  questions  from '../../../webpack/reducers/questions_reducer';
import {
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTION_FULFILLED,
  FETCH_QUESTION_USAGE_FULFILLED,
  FETCH_QUESTIONS_FULFILLED,
} from '../../../webpack/actions/types';

describe('questions reducer', () => {

  it('should save a question', () => {
    const question = {data:{id: 1, content: "Is this a question?", questionType: ""}};
    const action   = {type: SAVE_QUESTION_FULFILLED, payload: question };
    const startState = {};
    const nextState  = questions(startState, action);
    expect(nextState[1].id).to.equal(question.data.id);
  });

  it('should fetch questions', () => {
    const questionData = {data: [{id: 1, content: "Is this a question?", questionType: ""},
                                 {id: 2, content: "Whats your name", questionType: ""},
                                 {id: 3, content: "What is a question?", questionType: ""}]};
    const action = {type: FETCH_QUESTIONS_FULFILLED, payload: questionData};
    const startState = {};
    const nextState = questions(startState, action);
    expect(Object.keys(nextState).length).to.equal(3);
  });

  it('should not overwrite questions already in store', () => {
    const questionData = {data: [{id: 1, content: "Is this a question?", questionType: ""},
                                 {id: 2, content: "Whats your name", questionType: ""}]};
    const preExistingQuestion = {id: 3, content: "What is a question?", questionType: ""};
    const action = {type: FETCH_QUESTIONS_FULFILLED, payload: questionData};
    const startState = {3: preExistingQuestion};
    const nextState = questions(startState, action);
    expect(Object.keys(nextState).length).to.equal(3);
  });

  it('should fetch a question', () => {
    const questionData = {data: {id: 1, content: "Is this a question?", questionType: ""}};
    const action = {type: FETCH_QUESTION_FULFILLED, payload: questionData};
    const startState = {};
    const nextState = questions(startState, action);
    expect(Object.keys(nextState).length).to.equal(1);
  });

  it('should fetch usage data for a question', () => {
    const startState = {1: {id: 1, content: "Is this a question?", questionType: ""}};
    const action = {type: FETCH_QUESTION_USAGE_FULFILLED,
      payload: {data: {id: 1, surveillanceSystems: ['Test System'], surveillancePrograms: ['Test Program']}}};
    const nextState = questions(startState, action);
    expect(Object.keys(nextState).length).to.equal(1);
    expect(nextState[1].surveillanceSystems).to.include('Test System');
  });
});
