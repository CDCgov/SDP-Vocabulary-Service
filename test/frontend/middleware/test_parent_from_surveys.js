import { expect } from '../test_helper';
import MockStore from '../mock_store';

import parentFromSurveys from '../../../webpack/middleware/parent_from_surveys';

import {
  FETCH_SURVEYS_FULFILLED,
  FETCH_SURVEY_FULFILLED
} from '../../../webpack/actions/types';

describe('parentFromSurveys middleware', () => {
  let store;
  let action;

  const next = () => {
    1 + 1; //do nothing
  };

  beforeEach(() => {
    store = new MockStore();
    action = {
      type: FETCH_SURVEYS_FULFILLED,
      payload: {data: [
        {id: 1, name: 'People', description: 'List of people', parent: null},
        {id: 2, name: 'Colors', parent: {id: 1, name: 'People', description: 'List of people', parent: null}},
        {id: 3, name: 'Things', parent: {id: 1, name: 'People', description: 'List of people', parent: null}}
      ]}
    };
  });

  it('will transform the survey payload', () => {
    parentFromSurveys(store)(next)(action);
    const survey = action.payload.data[1];
    expect(survey.parent.name).to.equal('People');
    expect(survey.parent.description).to.be.an('undefined');
  });
});
