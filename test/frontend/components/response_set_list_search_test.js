import { expect, renderComponent } from '../test_helper';
import ResponseSetListSearch from '../../../webpack/components/ResponseSetListSearch';

function search(){}

describe('ResponseSetListSearch', () => {
  let component;

  beforeEach(() => {
    component = renderComponent(ResponseSetListSearch, {search});
  });

  it('should create a search bar', () => {
    expect(component.find("input[id='search']")).to.exist;
  });

});
