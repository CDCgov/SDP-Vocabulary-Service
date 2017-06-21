import { expect } from '../test_helper';
import MockStore from '../mock_store';

import responseSetsFromQuestions from '../../../webpack/middleware/response_sets_from_questions';

import {
  FETCH_QUESTIONS_FULFILLED,
  FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED
} from '../../../webpack/actions/types';

describe('responseSetsFromQuestions middleware', () => {
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
        {"id":1,"content":"Test question","responseSets":[{"id":1,"name":"Response Set 1"},{"id":2,"name":"Response Set 2"}]},
        {"id":2,"content":"Test question","responseSets":[{"id":1,"name":"Response Set 1"},{"id":2,"name":"Response Set 2"}]}
      ]}
    };
  });

  it('will dispatch actions for response sets in questions', () => {
    responseSetsFromQuestions(store)(next)(action);
    let dispatchedAction = store.dispatchedActions.find((a) => a.type === FETCH_RESPONSE_SET_FROM_MIDDLE_FULFILLED);
    expect(dispatchedAction).to.exist;
    expect(dispatchedAction.payload.data.name).to.equal('Response Set 1');
  });

  it('will transform the question payload', () => {
    responseSetsFromQuestions(store)(next)(action);
    const qs = action.payload.data[0];
    expect(qs.responseSets).to.include.members([1, 2]);
  });
});
