import {
  expect,
  renderComponent
} from '../../test_helper';
import QuestionEditContainer from '../../../../webpack/containers/questions/QuestionEditContainer';
import MockRouter from '../../mock_router';

describe('QuestionEditContainer ', () => {
  it('will show question edit page', () => {
    const props = {params:{},
      questions: {1: {id:1, content:'test', categoryId:1, responseTypeId:1, responseSets:[1]}},
      categories:{1: {id: 1, name: 'Test'}},
      responseSets: {1: {id: 1, name: 'Test'}},
      responseTypes:{1: {id: 1, name: 'Test'}},
      route: {id: 1, name: 'test'},
      router: new MockRouter()
    };
    const component = renderComponent(QuestionEditContainer, props);
    expect(component.find("div[class='container']").length).to.exist;
    expect(component.find("input[name='content']").length).to.exist;
    expect(component.find("form")).to.exist;
  });
});
