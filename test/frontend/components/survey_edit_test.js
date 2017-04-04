import { expect, renderComponent } from '../test_helper';
import SurveyEdit from '../../../webpack/components/SurveyEdit';
import MockRouter from '../mock_router';

describe('SurveyEdit', () => {
  let component, router, props, inputNode;

  beforeEach(() => {
    router = new MockRouter();
    props  = {
      questions: {},
      survey: {id: 6, name: "Test Form", questions: [1], versionIndependentId: "S-1", version: 1, surveyForms:[]},
      responseSets: {1: {id: 1, name: "Colors", description: "A list of colors", oid: "2.16.840.1.113883.3.1502.3.1"}},
      reorderQuestion:()=>{},
      removeQuestion: ()=>{},
      action: 'new',
      surveySubmitter:  ()=>{},
      removeForm:  ()=>{},
      reorderForm:  ()=>{},
      showResponseSetModal:  ()=>{},
      router: router,
      route: {},
      forms: {1: {id: 1, name: "Form 1", questionType: ""}}
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
