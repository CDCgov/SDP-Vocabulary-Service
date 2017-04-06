import { expect } from '../test_helper';
import  responseSets  from '../../../webpack/reducers/response_sets_reducer';
import {
  SAVE_RESPONSE_SET_FULFILLED,
  FETCH_RESPONSE_SET_FULFILLED,
  FETCH_RESPONSE_SET_USAGE_FULFILLED,
  FETCH_RESPONSE_SETS_FULFILLED,
} from '../../../webpack/actions/types';

describe('responseSets reducer', () => {

  it('should save a response set', () => {
    const responseSet = {data:{id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"}};
    const action = {type: SAVE_RESPONSE_SET_FULFILLED, payload: responseSet };
    const startState = [];
    const nextState = responseSets(startState, action);
    expect(nextState[1].id).to.equal(responseSet.data.id);
    expect(nextState[1].name).to.equal(responseSet.data.name);
  });

  it('should fetch response sets', () => {
    const responseSetData = {data: [{id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"},
                                 {id: 2, name: "People", description: "A list of people", oid: "2.16.840.1.113883.3.1502.3.2"},
                                 {id: 3, name: "Things", description: "A list of things", oid: "2.16.840.1.113883.3.1502.3.3"}]};
    const action = {type: FETCH_RESPONSE_SETS_FULFILLED, payload: responseSetData};
    const startState = {};
    const nextState = responseSets(startState, action);
    expect(Object.keys(nextState).length).to.equal(3);
  });

  it('should not overwrite response sets already in store', () => {
    const responseSetData = {data: [{id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"},
                                 {id: 3, name: "Things", description: "A list of things", oid: "2.16.840.1.113883.3.1502.3.3"}]};
    const action = {type: FETCH_RESPONSE_SETS_FULFILLED, payload: responseSetData};
    const preExistingResponseSet = {id: 2, name: "People", description: "A list of people", oid: "2.16.840.1.113883.3.1502.3.2"};
    const startState = {2: preExistingResponseSet};
    const nextState = responseSets(startState, action);
    expect(Object.keys(nextState).length).to.equal(3);
  });

  it('should fetch a response set', () => {
    const responseSetData = {data: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"}};
    const action = {type: FETCH_RESPONSE_SET_FULFILLED, payload: responseSetData};
    const startState = {};
    const nextState = responseSets(startState, action);
    expect(Object.keys(nextState).length).to.equal(1);
  });

  it('should fetch usage data for a response set', () => {
    const startState = {1: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"}};
    const action = {type: FETCH_RESPONSE_SET_USAGE_FULFILLED,
      payload: {data: {id: 1, surveillanceSystems: ['Test System'], surveillancePrograms: ['Test Program']}}};
    const nextState = responseSets(startState, action);
    expect(nextState[1].surveillanceSystems).to.include('Test System');
  });
});
