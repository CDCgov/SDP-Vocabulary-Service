import { expect } from '../test_helper';

import { byIdReducer } from '../../../webpack/reducers/reducer_generator';

import {
  FETCH_CONCEPT_SYSTEMS_FULFILLED
} from '../../../webpack/actions/types';

describe('concept systems reducer', () => {
  it('should fetch systems', () => {
    const conceptSystems = byIdReducer(FETCH_CONCEPT_SYSTEMS_FULFILLED);
    const conceptData = {data: [{"url":"","version":"1","name":"TestSystem","status":"","publisher":"","copyright":"","caseSensitive":false,"hierarchyMeaning":"","compositional":false,"content":"","count":0}]};
    const action = {type: FETCH_CONCEPT_SYSTEMS_FULFILLED, payload: conceptData};
    const startState = {};
    const nextState = conceptSystems(startState, action);
    expect(Object.keys(nextState).length).to.equal(1);
  });
});
