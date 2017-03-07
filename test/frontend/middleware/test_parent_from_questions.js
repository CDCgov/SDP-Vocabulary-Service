import { expect } from '../test_helper';
import MockStore from '../mock_store';

import parentFromQuestions from '../../../webpack/middleware/parent_from_questions';

import {
  FETCH_QUESTIONS_FULFILLED,
  FETCH_QUESTION_FULFILLED
} from '../../../webpack/actions/types';

describe('parentFromQuestions middleware', () => {
  let store;
  let action;

  const next = () => {
    1 + 1; //do nothing
  };

  beforeEach(() => {
    store = new MockStore();
    action = {
      type: FETCH_QUESTIONS_FULFILLED,
      payload: {data: [
        {id: 1, content: 'People', description: 'List of people', parent: null},
        {id: 2, content: 'Colors', parent: {id: 1, content: 'People', description: 'List of people', parent: null}},
        {id: 3, content: 'Things', parent: {id: 1, content: 'People', description: 'List of people', parent: null}}
      ]}
    };
  });

  // it('will dispatch actions for parent questions in questions', () => {
  //   parentFromQuestions(store)(next)(action);
  //   let dispatchedAction = store.dispatchedActions.find((a) => a.type === FETCH_QUESTION_FULFILLED);
  //   expect(dispatchedAction).to.exist;
  //   expect(dispatchedAction.payload.data.name).to.equal('People');
  // });

  it('will transform the question payload', () => {
    parentFromQuestions(store)(next)(action);
    const q = action.payload.data[1];
    expect(q.parent.name).to.equal('People');
    expect(q.parent.description).to.be.an('undefined');
  });
});
