import { expect, renderComponent } from '../test_helper';
import QuestionList from '../../../webpack/components/QuestionList';

describe('QuestionList', () => {
  let component;

  beforeEach(() => {
    const questions = {1: {id: 1, content: "Is this a question?", questionType: ""},
                       2: {id: 2, content: "Whats your name", questionType: ""},
                       3: {id: 3, content: "What is a question?", questionType: ""}};
    component = renderComponent(QuestionList, {questions});
  });

  it('should create list of questions', () => {
    expect(component.find("div[class='question-group']").length).to.equal(3);
  });

});
