import { expect, renderComponent } from '../../test_helper';
import SectionQuestionList from '../../../../webpack/components/sections/SectionQuestionList';

describe('SectionQuestionList', () => {
  let component;

  beforeEach(() => {
    const questions = [{id: 1, content: "Is this a question?", category: ""},
                       {id: 2, content: "Whats your name", category: ""},
                       {id: 3, content: "What is a question?", category: ""}];
    component = renderComponent(SectionQuestionList, {questions});
  });

  it('should create list of questions', () => {
    expect(component.find("div[class='result-description']").length).to.equal(3);
  });

});
