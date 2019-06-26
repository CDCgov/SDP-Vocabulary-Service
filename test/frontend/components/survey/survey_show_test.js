import { expect, renderComponent } from '../../test_helper';
import SurveyShow from '../../../../webpack/components/surveys/SurveyShow';
import InfoModal from '../../components/InfoModal';

describe('SurveyShow', () => {
  let component;

  beforeEach(() => {
    const props = {
      currentUser:{},
      publishSurvey: ()=> {},
      setBreadcrumbPath: () => {},
      router: {},
      survey: {
        id: 1,
        name: "Robot Questionaire",
        surveySections: [1,2,3]
      },
      sections: [
        {id:1,name:"Bleep",createdBy:{email:"test_author@gmail.com"},createdAt:"2016-12-27T23:40:54.505Z",updatedAt:"2016-12-28T23:40:54.505Z",versionIndependentId:"SECT-1",version:1,controlNumber:"","questions":[]},
        {id:2,name:"Bloop",createdBy:{email:"test_author@gmail.com"},createdAt:"2016-12-28T23:40:54.505Z",updatedAt:"2016-12-29T23:40:54.505Z",versionIndependentId:"SECT-1",version:1,controlNumber:"","questions":[]},
        {id:3,name:"I am a robot",createdBy:{email:"test_author@gmail.com"},createdAt:"2016-12-29T23:40:54.505Z",updatedAt:"2016-12-30T23:40:54.505Z",versionIndependentId:"SECT-1",version:1,controlNumber:"","questions":[]}
      ],
      deleteSurvey: ()=> {}
    };
    const startState = {};
    component = renderComponent(SurveyShow, props, startState);
  });

  it('should create a list of sections', () => {
    // Drop out of JQuery and just use draw javascript selectors
    // Removed Linked Sections.
    expect(component.find("h2[class='panel-title']")).to.contain(': 3');
  });

  it('should render an empty list of sections', () => {
    let emptyComponent = renderComponent(SurveyShow, {survey: {id: 1, name: "Test"}, setBreadcrumbPath: () => {}, name: 'test'}, {});
    expect(emptyComponent[0].querySelectorAll('.survey-section').length).to.equal(0);
  });

});
