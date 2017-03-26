import {
  expect,
  renderComponent
} from '../test_helper';
import SurveyEditContainer from '../../../webpack/containers/SurveyEditContainer';
import MockRouter from '../mock_router';

describe('SurveyEditContainer ', () => {
  it('will show survey edit page', () => {
    const props = {params:{},
                  survey: {id: 1, name: 'Test Survey'},
                  forms:  {1: {id: 1, name: 'Form 1'}, 2: {id: 2, name: 'Form 2'}},
                  questions: {},
                  route:  '',
                  route: {id: 1, name: 'test'},
                  router: new MockRouter(),
                  currentUser: {}
    };
    const component = renderComponent(SurveyEditContainer, props);
    expect(component.find("div[id='survey-div']").length).to.equal(1);
  });
});
