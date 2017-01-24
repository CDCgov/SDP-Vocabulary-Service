import { expect } from '../test_helper';
import MockStore from '../mock_store';

import questionsFromResponseSets from '../../../webpack/middleware/questions_from_response_sets';

import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_QUESTIONS_FULFILLED
} from '../../../webpack/actions/types';

describe('questionsFromResponseSets middleware', () => {
  let store;
  let action;

  const next = () => {
    1 + 1; //do nothing
  };

  beforeEach(() => {
    store = new MockStore();
    action = {
      type: FETCH_RESPONSE_SETS_FULFILLED,
      payload: {data: [
        {id: 1, name: 'Hello', questions: [{id: 1, content: 'Yes?'}, {id: 2, content: 'OK?'}]},
        {id: 2, name: 'Goodbye', questions: [{id: 1, content: 'Yes?'}, {id: 2, content: 'OK?'}]}
      ]}
    };
  });

  it('will dispatch actions for questions in response sets', () => {
    questionsFromResponseSets(store)(next)(action);
    let dispatchedAction = store.dispatchedActions.find((a) => a.type === FETCH_QUESTIONS_FULFILLED);
    expect(dispatchedAction).to.exist;
    expect(dispatchedAction.payload.data[0].content).to.equal('Yes?');
  });

  it('will transform the response set payload', () => {
    questionsFromResponseSets(store)(next)(action);
    const rs = action.payload.data[0];
    expect(rs.questions).to.include.members([1, 2]);
  });
});
