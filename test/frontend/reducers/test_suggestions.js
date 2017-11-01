import { expect } from '../test_helper';
import  suggestions  from '../../../webpack/reducers/suggestions_reducer';
import {
  FETCH_SUGGESTIONS_FULFILLED
} from '../../../webpack/actions/types';

describe('suggestions reducer', () => {

  it('should fetch suggestions', () => {
    const suggestionsData = {data: { suggest: { searchSuggest: [{options:[
                                {text:"test","_type":"section","_id":"41","_source":{"version":1}},
                                {text:"test2","_type":"section","_id":"42","_source":{"version":1}},
                                {text:"test3","_type":"section","_id":"43","_source":{"version":1}},
                                {text:"test3","_type":"section","_id":"44","_source":{"version":2}}
                              ]}]}}};
    const action = {type: FETCH_SUGGESTIONS_FULFILLED, payload: suggestionsData};
    const startState = {};
    const nextState = suggestions(startState, action);
    expect(nextState.length).to.equal(3);
  });

});
