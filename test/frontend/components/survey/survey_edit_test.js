import { expect, renderComponent } from '../../test_helper';
import SurveyEdit from '../../../../webpack/components/surveys/SurveyEdit';
import MockRouter from '../../mock_router';

describe('SurveyEdit', () => {
  let component, router, props, inputNode;

  beforeEach(() => {
    router = new MockRouter();
    props  = {
      questions: {},
      survey: {id: 6, name: "Test Section", questions: [1], versionIndependentId: "S-1", version: 1, surveySections:[]},
      responseSets: {1: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"}},
      reorderQuestion:()=>{},
      removeQuestion: ()=>{},
      action: 'new',
      surveySubmitter:  ()=>{},
      removeSection:  ()=>{},
      reorderSection:  ()=>{},
      showResponseSetModal:  ()=>{},
      router: router,
      route: {},
      sections: {1: {id: 1, name: "Section 1", category: ""}}
    };

    component = renderComponent(SurveyEdit, props);
    inputNode = component.find("input[id='content']")[0];
  });

  it('should stop user from leaving unsaved data', () => {
    expect(router.getLeaveHookResponse()).to.equal(true);
    //Broken by using confirm(), a job for cucumber tests
    //TestUtils.Simulate.change(inputNode, {target: {value: 'different'}});
    //expect(router.getLeaveHookResponse()).to.equal(false);
  });

});
