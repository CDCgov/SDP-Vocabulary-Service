import { expect, renderComponent } from '../test_helper';
import QuestionWidget from '../../../webpack/components/QuestionWidget';
import routes from '../mock_routes';

describe('QuestionWidget', () => {
  let component;

  beforeEach(() => {
    const question = {id: 1, content: "Is this a question?", question_type: ""};
    component = renderComponent(QuestionWidget, {question, routes});
  });

  it('should create question block', () => {
    expect(component.find("div[class='question-container']").length).to.equal(1);
    expect(component.find("div[class='response-set-details']").length).to.equal(1);
  });
});
