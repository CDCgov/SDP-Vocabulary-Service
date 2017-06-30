import { expect, renderComponent } from '../test_helper';
import FormQuestionList from '../../../webpack/components/FormQuestionList';

describe('FormQuestionList', () => {
  let component;

  beforeEach(() => {
    const questions = [{id: 1, content: "Is this a question?", questionType: ""},
                       {id: 2, content: "Whats your name", questionType: ""},
                       {id: 3, content: "What is a question?", questionType: ""}];
    component = renderComponent(FormQuestionList, {questions});
  });

  it('should create list of questions', () => {
    expect(component.find("div[class='result-description']").length).to.equal(3);
  });

});
