import { expect } from '../test_helper';
import MockStore from '../mock_store';

import parentFromResponseSets from '../../../webpack/middleware/parent_from_response_sets';

import {
  FETCH_RESPONSE_SETS_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED
} from '../../../webpack/actions/types';

describe('parentFromResponseSets middleware', () => {
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
        {id: 1, name: 'People', description: 'List of people', parent: null},
        {id: 2, name: 'Colors', parent: {id: 1, name: 'People', description: 'List of people', parent: null}},
        {id: 3, name: 'Things', parent: {id: 1, name: 'People', description: 'List of people', parent: null}}
      ]}
    };
  });

  // it('will dispatch actions for parent response sets in response sets', () => {
  //   parentFromResponseSets(store)(next)(action);
  //   let dispatchedAction = store.dispatchedActions.find((a) => a.type === FETCH_RESPONSE_SET_FULFILLED);
  //   expect(dispatchedAction).to.exist;
  //   expect(dispatchedAction.payload.data.name).to.equal('People');
  // });

  it('will transform the response set payload', () => {
    parentFromResponseSets(store)(next)(action);
    const rs = action.payload.data[1];
    expect(rs.parent.name).to.equal('People');
    expect(rs.parent.description).to.be.an('undefined');
  });
});
