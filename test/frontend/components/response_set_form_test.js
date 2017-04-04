import { expect, renderComponent } from '../test_helper';
import ResponseSetForm from '../../../webpack/components/ResponseSetForm';
import MockRouter from '../mock_router';

describe('ResponseSetForm', () => {
  let component, router, inputNode, props;

  beforeEach(() => {
    router = new MockRouter();
    props  = {
      responseSet: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1",
        responses:[{value: 'val', codeSystem: 'codesystem', displayName: 'displayname'}]},
      router: router,
      route: {},
      responseSetSubmitter: ()=>{},
      action: 'revise',
    };
    component = renderComponent(ResponseSetForm, props);
    inputNode = component.find("input[id='content']")[0]
  });

  it('should stop user from leaving unsaved data', () => {
    expect(router.getLeaveHookResponse()).to.equal(true);
    //Broken by using confirm(), a job for cucumber tests
    //TestUtils.Simulate.change(inputNode, {target: {value: 'different'}});
    //expect(router.getLeaveHookResponse()).to.equal(false);
  });

});
