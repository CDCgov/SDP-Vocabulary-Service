import { normalize } from 'normalizr';
import { questionsSchema, questionSchema } from '../../../webpack/schema';
import { expect } from '../test_helper';
import  questions  from '../../../webpack/reducers/questions_reducer';
import {
  SAVE_QUESTION_FULFILLED,
  FETCH_QUESTION_USAGE_FULFILLED,
  ADD_ENTITIES_FULFILLED
} from '../../../webpack/actions/types';

describe('questions reducer', () => {

  it('should save a question', () => {
    const question = {data:{id: 1, content: "Is this a question?", category: ""}};
    const action   = {type: SAVE_QUESTION_FULFILLED, payload: question };
    const startState = {};
    const nextState  = questions(startState, action);
    expect(nextState[1].id).to.equal(question.data.id);
  });

  it('should fetch questions', () => {
    const questionData = [{id: 1, content: "Is this a question?", category: ""},
                                 {id: 2, content: "Whats your name", category: ""},
                                 {id: 3, content: "What is a question?", category: ""}];
    const payloadData = normalize(questionData, questionsSchema).entities;
    const action = {type: ADD_ENTITIES_FULFILLED, payload: payloadData};
    const startState = {};
    const nextState = questions(startState, action);
    expect(Object.keys(nextState).length).to.equal(3);
  });

  it('should not overwrite questions already in store', () => {
    const questionData = [{id: 1, content: "Is this a question?", category: ""},
                                 {id: 2, content: "Whats your name", category: ""}];
    const preExistingQuestion = {id: 3, content: "What is a question?", category: ""};
    const payloadData = normalize(questionData, questionsSchema).entities;
    const action = {type: ADD_ENTITIES_FULFILLED, payload: payloadData};
    const startState = {3: preExistingQuestion};
    const nextState = questions(startState, action);
    expect(Object.keys(nextState).length).to.equal(3);
  });

  it('should fetch a question', () => {
    const questionData = {id: 1, content: "Is this a question?", category: ""};
    const payloadData = normalize(questionData, questionSchema).entities;
    const action = {type: ADD_ENTITIES_FULFILLED, payload: payloadData};
    const startState = {};
    const nextState = questions(startState, action);
    expect(Object.keys(nextState).length).to.equal(1);
  });

  it('should fetch usage data for a question', () => {
    const startState = {1: {id: 1, content: "Is this a question?", category: ""}};
    const action = {type: FETCH_QUESTION_USAGE_FULFILLED,
      payload: {data: {id: 1, surveillanceSystems: ['Test System'], surveillancePrograms: ['Test Program']}}};
    const nextState = questions(startState, action);
    expect(Object.keys(nextState).length).to.equal(1);
    expect(nextState[1].surveillanceSystems).to.include('Test System');
  });
});
