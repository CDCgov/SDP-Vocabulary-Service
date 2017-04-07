import { expect } from '../test_helper';

import { byIdReducer, byIdWithIndividualReducer } from '../../../webpack/reducers/reducer_generator';

describe('reducer generator', () => {
  const BATCH_SUCCESS = 'BATCH_SUCCESS';
  const INDIVIDUAL_SUCCESS = 'INDIVIDUAL_SUCCESS';
  it('should generate a reducer that works by id', () => {
    const idReducer = byIdReducer(BATCH_SUCCESS);
    const payload = {data: [{id: 1, name: 'John Peters'}, {id: 2, name: 'Steve Carlsberg'}]};
    const action = {type: BATCH_SUCCESS, payload: payload};
    const startState = {};
    const nextState = idReducer(startState, action);
    expect(Object.keys(nextState).length).to.equal(2);
    expect(nextState[2].name).to.equal('Steve Carlsberg');
  });

  it('should generate a reducer that works by id with individual updates', () => {
    const reducer = byIdWithIndividualReducer(BATCH_SUCCESS, INDIVIDUAL_SUCCESS);
    const payload = {data: {id: 1, name: 'The Farmer'}};
    const action = {type: INDIVIDUAL_SUCCESS, payload: payload};
    const startState = {1: {id: 1, name: 'John Peters'}, 2: {id: 2, name: 'Steve Carlsberg'}};
    const nextState = reducer(startState, action);
    expect(Object.keys(nextState).length).to.equal(2);
    expect(nextState[2].name).to.equal('Steve Carlsberg');
    expect(nextState[1].name).to.equal('The Farmer');
  });
});
