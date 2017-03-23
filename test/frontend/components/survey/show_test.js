import { expect, renderComponent } from '../../test_helper';
import SurveyShow from '../../../../webpack/components/surveys/Show';

describe('SurveyShow', () => {
  let component;

  beforeEach(() => {
    const forms = [
      {id:1,name:"Bleep",createdBy:{email:"test_author@gmail.com"},createdAt:"2016-12-27T23:40:54.505Z",updatedAt:"2016-12-28T23:40:54.505Z",versionIndependentId:"F-1",version:1,controlNumber:"","questions":[]},
      {id:2,name:"Bloop",createdBy:{email:"test_author@gmail.com"},createdAt:"2016-12-28T23:40:54.505Z",updatedAt:"2016-12-29T23:40:54.505Z",versionIndependentId:"F-1",version:1,controlNumber:"","questions":[]},
      {id:3,name:"I am a robot",createdBy:{email:"test_author@gmail.com"},createdAt:"2016-12-29T23:40:54.505Z",updatedAt:"2016-12-30T23:40:54.505Z",versionIndependentId:"F-1",version:1,controlNumber:"","questions":[]}
    ];
    const survey = {
      name: "Robot Questionaire",
      surveyForms: [1,2,3]
    }
    component = renderComponent(SurveyShow, {survey, forms});
  });

  it('should create a list of forms', () => {
    // Drop out of JQuery and just use draw javascript selectors
    expect(component[0].querySelectorAll('.survey-form').length).to.equal(3);
  });

});
