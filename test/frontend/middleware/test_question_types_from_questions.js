import { expect } from '../test_helper';
import MockStore from '../mock_store';

import questionTypesFromQuestions from '../../../webpack/middleware/question_types_from_questions';

import {
  FETCH_QUESTIONS_FULFILLED,
  FETCH_QUESTION_TYPE_FULFILLED
} from '../../../webpack/actions/types';

describe('questionTypesFromQuestions middleware', () => {
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
        {"id":1,"content":"Test question","questionType":{"id":1,"name":"Question Type 1"}},
        {"id":2,"content":"Test question","questionType":{"id":2,"name":"Question Type 2"}}
      ]}
    };
  });

  it('will dispatch actions for questions in response sets', () => {
    questionTypesFromQuestions(store)(next)(action);
    let dispatchedAction = store.dispatchedActions.find((a) => a.type === FETCH_QUESTION_TYPE_FULFILLED);
    expect(dispatchedAction).to.exist;
    expect(dispatchedAction.payload.data.name).to.equal('Question Type 1');
  });

  it('will transform the question payload', () => {
    questionTypesFromQuestions(store)(next)(action);
    const qs = action.payload.data;
    expect(qs[0].questionTypeId).to.equal(1);
    expect(qs[1].questionTypeId).to.equal(2);
  });
});
