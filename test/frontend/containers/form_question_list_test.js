import { expect, renderComponent } from '../test_helper';
import FormsQuestionList from '../../../webpack/containers/FormsQuestionList';


describe('FormsQuestionList', () => {
  it('will show a list of questions', () => {
    const state = {questions: {1:{id: 1, content: 'What is the meaning of life?'}, 2:{id: 2, content: 'Is this a test?'}}};
    const props = {responseSets: {1:{id: 1, name: 'Response Set 1'}}};
    const component = renderComponent(FormsQuestionList, props, state);
    expect(component.find("div:contains('What is the meaning of life?')")).to.exist;
    expect(component.find("div:contains('Is this a test?')")).to.exist;
  });
});
