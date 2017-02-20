import {
  expect,
  renderComponent
} from '../test_helper';
import QuestionIndexContainer from '../../../webpack/containers/QuestionIndexContainer';

describe('QuestionIndexContainer ', () => {
  it('will show a list of questions and a search bar', () => {
    const component = renderComponent(QuestionIndexContainer);
    expect(component.find("div[class='question-group']").length).to.exist;
    expect(component.find("input[id='search']")).to.exist;
  });
});
