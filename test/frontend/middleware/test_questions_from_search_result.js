import { expect } from '../test_helper';
import MockStore from '../mock_store';

import questionsFromSearchResult from '../../../webpack/middleware/questions_from_search_result';

import {
  FETCH_SEARCH_RESULTS_FULFILLED,
  FETCH_QUESTION_FULFILLED
} from '../../../webpack/actions/types';

describe('questionsFromSearchResult middleware', () => {
  let store;
  let action;

  const results = {hits: {hits: [
    {Type: 'question', Source: {id:1, name: "M?", questionTypeId: 1, createdBy: {id: 1}}},
    {Type: 'question', Source: {id:2, name: "F?", questionTypeId: 1, createdBy: {id: 1}}}
  ]}};

  const next = () => {
    1 + 1; //do nothing
  };

  beforeEach(() => {
    store = new MockStore();
    action = {
      type: FETCH_SEARCH_RESULTS_FULFILLED,
      payload: {data: results}
    };
  });

  it('will dispatch actions for questions in forms', () => {
    questionsFromSearchResult(store)(next)(action);
    let dispatchedAction = store.dispatchedActions.find((a) => a.type === FETCH_QUESTION_FULFILLED);
    expect(dispatchedAction).to.exist;
    expect(dispatchedAction.payload.data.content).to.equal('M?');
  });
});
