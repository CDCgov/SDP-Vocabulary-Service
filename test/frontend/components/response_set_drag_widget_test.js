import { expect, renderComponent, createComponent } from '../test_helper';
import TestUtils from 'react-addons-test-utils';
import ResponseSetDragWidget from '../../../webpack/components/ResponseSetDragWidget';
import MockRouter from '../mock_router';

describe('ResponseSetDragWidget', () => {
  let component, router, inputNode, props;

  beforeEach(() => {
    props = { handleResponseSetsChange: ()=>{},
              responseSets: {1: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"},
                             2: {id: 2, name: "test", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.2"}
                            },
              selectedResponseSets: [{id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"},
                                     {id: 2, name: "test", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.2"}]};

    component = renderComponent(ResponseSetDragWidget, props);
    inputNode = component.find("div[name='row response-set-row']")[0]
  });

  it('should create response set drag widget', () => {
    expect(component.find("div[name='linked_response_sets']").length).to.exist;
    expect(component.find("div[class='selected_response_sets']").length).to.exist;
    expect(component.find("ul[id='response_set_id_1']").length).to.equal(1);
    expect(component.find("ul[id='response_set_id_2']").length).to.equal(1);
  });

});
