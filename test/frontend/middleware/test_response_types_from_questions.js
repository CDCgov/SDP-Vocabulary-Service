import { expect } from '../test_helper';
import MockStore from '../mock_store';

import responseTypesFromQuestions from '../../../webpack/middleware/response_types_from_questions';

import {
  FETCH_QUESTIONS_FULFILLED,
  FETCH_RESPONSE_TYPE_FULFILLED
} from '../../../webpack/actions/types';

describe('responseTypesFromQuestions middleware', () => {
  let store;
  let action;

  const next = () => {
    1 + 1; //do nothing
  };

  beforeEach(() => {
    store  = new MockStore();
    action = {
      type: FETCH_QUESTIONS_FULFILLED,
      payload: {data: [
        {"id":1,"content":"Test question","responseType":{"id":1,"name":"Response Type 1"}},
        {"id":2,"content":"Test question","responseType":{"id":2,"name":"Response Type 2"}}
      ]}
    };
  });

  it('will dispatch action for response type in question', () => {
    responseTypesFromQuestions(store)(next)(action);
    let dispatchedAction = store.dispatchedActions.find((a) => a.type === FETCH_RESPONSE_TYPE_FULFILLED);
    expect(dispatchedAction).to.exist;
    expect(dispatchedAction.payload.data.name).to.equal('Response Type 1');
  });

  it('will transform the question payload', () => {
    responseTypesFromQuestions(store)(next)(action);
    const qs = action.payload.data;
    expect(qs[0].responseTypeId).to.equal(1);
    expect(qs[1].responseTypeId).to.equal(2);
  });
});
