import {
  expect,
  renderComponent
} from '../test_helper';
import QuestionListContainer from '../../../webpack/containers/QuestionListContainer';

describe('QuestionListContainer ', () => {
  it('will show a list of questions and a search bar', () => {
    const component = renderComponent(QuestionListContainer);
    expect(component.find("div[class='question-group']").length).to.exist;
    expect(component.find("input[id='search']")).to.exist;
  });
});
