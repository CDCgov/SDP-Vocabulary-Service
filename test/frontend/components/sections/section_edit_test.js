import { expect, renderComponent } from '../../test_helper';
import SectionEdit from '../../../../webpack/components/sections/SectionEdit';
import MockRouter from '../../mock_router';

describe('SectionEdit', () => {
  let component, router, props, inputNode;

  beforeEach(() => {
    router = new MockRouter();
    props  = {
      section: {id: 6, name: "Test Section", questions: [1], versionIndependentId: "SECT-1", version: 1, sectionQuestions:[]},
      responseSets: {1: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"}},
      reorderQuestion:()=>{},
      removeQuestion: ()=>{},
      action: 'new',
      sectionSubmitter:  ()=>{},
      showResponseSetModal:  ()=>{},
      router: router,
      route: {id:1, name: 'test'},
      questions: {1: {id: 1, content: "Is this a question?", category: "", responseSets: [1], concepts: [{code:"Code 1",display:" Display Name 1",system:"Test system 1"}]}}
    };

    component = renderComponent(SectionEdit, props);
    inputNode = component.find("input[id='content']")[0];
  });

  it('should stop user from leaving unsaved data', () => {
    expect(router.getLeaveHookResponse()).to.equal(true);
    //Broken by using confirm(), a job for cucumber tests
    //TestUtils.Simulate.change(inputNode, {target: {value: 'different'}});
    //expect(router.getLeaveHookResponse()).to.equal(false);
  });

});
