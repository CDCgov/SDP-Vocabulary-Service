import { expect, renderComponent } from '../test_helper';
import ResponseSetList from '../../../webpack/components/ResponseSetList';

describe('ResponseSetList', () => {
  let component;

  beforeEach(() => {
    const responseSets = [{id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"},
                          {id: 2, name: "Colors Improved", description: "A better list of colors", oid: "3.16.840.1.113883.3.1502.3.1"},
                          {id: 3, name: "People", description: "A list of people", oid: "4.16.840.1.113883.3.1502.3.1"}];
    component = renderComponent(ResponseSetList, {responseSets});
  });

  it('should create list of response sets', () => {
    expect(component.find("li[class='u-result-content-item']").length).to.equal(3);
  });

});
