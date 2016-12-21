import { expect } from '../test_helper';
import  questions  from '../../../webpack/reducers/questions';

import {
  ADD_QUESTION,
  REMOVE_QUESTION
} from '../../../webpack/actions/types';

describe('questions reducer', () => {
  it('should add a question', () => {
    const action = {type: ADD_QUESTION, payload: {content: 'Is this a test?'}};
    const startState = [{content: 'What is the meaning of life?'}];
    const nextState = questions(startState, action);
    expect(nextState[1].content).to.equal('Is this a test?');
  });

  it('should remove a question', () => {
    const action = {type: REMOVE_QUESTION, payload: 1};
    const startState = [{content: 'What is the meaning of life?'}, {content: 'Is this a test?'}, {content: 'What?'}];
    const nextState = questions(startState, action);
    expect(nextState.length).to.equal(2);
    expect(nextState[1].content).to.equal('What?');
  });
});
