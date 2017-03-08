import { expect, renderComponent } from '../test_helper';
import ResponseSetList from '../../../webpack/components/ResponseSetList';

describe('ResponseSetList', () => {
  let component;

  beforeEach(() => {
    const responseSets = {1: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"},
                          2: {id: 2, name: "Colors Improved", description: "A better list of colors", oid: "3.16.840.1.113883.3.1502.3.1"},
                          3: {id: 3, name: "People", description: "A list of people", oid: "4.16.840.1.113883.3.1502.3.1"}};
    component = renderComponent(ResponseSetList, {responseSets});
  });

  it('should create list of response sets', () => {
    expect(component.find("div[class='response-set-group']").length).to.equal(3);
  });

});
