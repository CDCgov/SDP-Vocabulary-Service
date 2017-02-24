import { expect } from '../test_helper';
import conceptSystems  from '../../../webpack/reducers/concept_systems_reducer';
import _ from 'lodash';
import {
  FETCH_CONCEPT_SYSTEMS_FULFILLED
} from '../../../webpack/actions/types';

describe('concept systems reducer', () => {
  it('should fetch systems', () => {
    const conceptData = {data: [{"url":"","version":"1","name":"TestSystem","status":"","publisher":"","copyright":"","caseSensitive":false,"hierarchyMeaning":"","compositional":false,"content":"","count":0}]};
    const action = {type: FETCH_CONCEPT_SYSTEMS_FULFILLED, payload: conceptData};
    const startState = {};
    const nextState = conceptSystems(startState, action);
    console.log(nextState)
    expect(Object.keys(nextState).length).to.equal(1);
  });
});
