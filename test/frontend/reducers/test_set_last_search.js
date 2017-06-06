import { expect } from '../test_helper';
import  lastSearch  from '../../../webpack/reducers/last_search_reducer';
import {
  SET_LAST_SEARCH
} from '../../../webpack/actions/types';

describe('lastSearch reducer', () => {

  it('should set last search parameters', () => {
    const lastSearchParams = { type: 'form', search: 'test', programs: ['Prog1', 'Prog2', 'Prog3'], systems: ['Sys1'], mystuff: false };
    const action = {type: SET_LAST_SEARCH, payload: lastSearchParams};
    const startState = {};
    const nextState = lastSearch(startState, action);
    expect(nextState.programs.length).to.equal(3);
  });

});
