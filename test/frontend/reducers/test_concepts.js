import { expect } from '../test_helper';
import concepts  from '../../../webpack/reducers/concepts_reducer';
import _ from 'lodash';
import {
  FETCH_CONCEPTS_FULFILLED,
  FETCH_CONCEPT_SYSTEMS_FULFILLED
} from '../../../webpack/actions/types';

describe('concepts reducer', () => {
  it('should fetch concepts', () => {
    const conceptData = {config:{params:{system:'TestSystem'}}, data: {"url":"","identifier":null,"version":"","name":"","status":"","description":"","expansion":{"identifier":"","timestamp":"","contains":[{"system":"TestSystem","version":"","code":"5","display":"Referral for drug rehab"}]}}};
    const action = {type: FETCH_CONCEPTS_FULFILLED, payload: conceptData};
    const startState = {};
    const nextState = concepts(startState, action);
    expect(Object.keys(nextState).length).to.equal(1);
  });
});
