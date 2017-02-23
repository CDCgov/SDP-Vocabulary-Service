import { expect } from '../test_helper';
import  searchResults  from '../../../webpack/reducers/search_results_reducer';
import {
  FETCH_SEARCH_RESULTS_FULFILLED
} from '../../../webpack/actions/types';

describe('searchResults reducer', () => {

  it('should fetch search results', () => {
    const searchResultData = {data: { hits: { hits: [{id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"},
                                 {id: 2, name: "People", description: "A list of people", oid: "2.16.840.1.113883.3.1502.3.2"},
                                 {id: 3, name: "Things", description: "A list of things", oid: "2.16.840.1.113883.3.1502.3.3"}]}}};
    const action = {type: FETCH_SEARCH_RESULTS_FULFILLED, payload: searchResultData};
    const startState = {};
    const nextState = searchResults(startState, action);
    expect(nextState.hits.hits.length).to.equal(3);
  });

});
