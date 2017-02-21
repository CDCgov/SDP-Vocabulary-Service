import { expect, renderComponent } from '../test_helper';
import FormQuestionList from '../../../webpack/components/FormQuestionList';
import routes from '../mock_routes';

describe('FormQuestionList', () => {
  let component;

  beforeEach(() => {
    const questions = [1: {id: 1, content: "Is this a question?", questionType: ""},
                       2: {id: 2, content: "Whats your name", questionType: ""},
                       3: {id: 3, content: "What is a question?", questionType: ""}];
    component = renderComponent(FormQuestionList, {questions, routes});
  });

  it('should create list of questions', () => {
    expect(component.find("div[class='question-group']").length).to.equal(3);
  });

});
