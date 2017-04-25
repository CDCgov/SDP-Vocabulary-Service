import { expect } from '../test_helper';
import MockStore from '../mock_store';

import parentFromForms from '../../../webpack/middleware/parent_from_forms';

import {
  FETCH_FORMS_FULFILLED,
  FETCH_FORM_FULFILLED
} from '../../../webpack/actions/types';

describe('parentFromForms middleware', () => {
  let store;
  let action;

  const next = () => {
    1 + 1; //do nothing
  };

  beforeEach(() => {
    store = new MockStore();
    action = {
      type: FETCH_FORMS_FULFILLED,
      payload: {data: [
        {id: 1, name: 'People', description: 'List of people', parent: null},
        {id: 2, name: 'Colors', parent: {id: 1, name: 'People', description: 'List of people', parent: null}},
        {id: 3, name: 'Things', parent: {id: 1, name: 'People', description: 'List of people', parent: null}}
      ]}
    };
  });

  it('will transform the form payload', () => {
    parentFromForms(store)(next)(action);
    const form = action.payload.data[1];
    expect(form.parent.name).to.equal('People');
    expect(form.parent.description).to.be.an('undefined');
  });
});
