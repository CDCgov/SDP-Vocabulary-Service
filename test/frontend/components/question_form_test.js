import { expect, renderComponent, createComponent } from '../test_helper';
import TestUtils from 'react-addons-test-utils';
import QuestionForm from '../../../webpack/components/QuestionForm';
import routes from '../mock_routes';
import MockRouter from '../mock_router';

describe('QuestionForm', () => {
  let component, router, inputNode, props;

  beforeEach(() => {
    router = new MockRouter();
    props  = {
      question: {id: 1, content: "Is this a question?", questionType: "", responseSets: [1], concepts: [{code:"Code 1",display:" Display Name 1",system:"Test system 1"}]},
      router: router,
      routes: routes,
      questionSubmitter: ()=>{},
      questionTypes: {},
      responseSets:  {1: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"}},
      responseTypes: {}
    };
    component = renderComponent(QuestionForm, props);
    inputNode = component.find("input[id='content']")[0]
  });

  it('should stop user from leaving unsaved data', () => {
    expect(router.getLeaveHookResponse()).to.equal(true);
    //Broken by using confirm(), a job for cucumber tests
    //TestUtils.Simulate.change(inputNode, {target: {value: 'different'}});
    //expect(router.getLeaveHookResponse()).to.equal(false);
  });

});
