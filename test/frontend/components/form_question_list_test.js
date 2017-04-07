import { expect, renderComponent } from '../test_helper';
import FormQuestionList from '../../../webpack/components/FormQuestionList';

describe('FormQuestionList', () => {
  let component;

  beforeEach(() => {
    const questions = [{id: 1, content: "Is this a question?", questionType: ""},
                       {id: 2, content: "Whats your name", questionType: ""},
                       {id: 3, content: "What is a question?", questionType: ""}];
    const responseSets = [{name: 'None'},{name: 'None'},{name: 'None'}];
    component = renderComponent(FormQuestionList, {questions, responseSets});
  });

  it('should create list of questions', () => {
    expect(component.find("div[class='u-result-group']").length).to.equal(3);
  });

});
