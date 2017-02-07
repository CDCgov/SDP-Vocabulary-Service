import { expect } from '../test_helper';
import { getMostRecentResponseSets } from '../../../webpack/selectors/response_set_selectors';

describe('getMostRecentResponseSets', () => {
  it('should only show the most recent versions of response sets', () => {
    const state = {responseSets: {
      1: {name: 'Old', version: 1, mostRecent: 2},
      2: {name: 'New', version: 2, mostRecent: 2},
      3: {name: 'Thingy', version: 5, mostRecent: 5},
      4: {name: 'Old Things', version: 2, mostRecent: 5}
    }};
    const mr = getMostRecentResponseSets(state);
    expect(mr[1]).to.be.undefined;
    expect(mr[2].name).to.equal('New');
    expect(mr[3].name).to.equal('Thingy');
    expect(mr[4]).to.be.undefined;
  });
});
