import {
  expect,
  renderComponent
} from '../test_helper';
import QuestionShowContainer from '../../../webpack/containers/QuestionShowContainer';

describe('QuestionShowContainer ', () => {
  it('will show a question', () => {
    const props = {
      question: {id: 1, concepts: [], content: "Is this a question?", createdBy: { email: "test@test.com" }, questionType: ""},
      params: {qId: 1},
      router: {}
    };
    const state = {
      questions: {1: {id:1, concepts: [], createdBy: {email: 'test'}, content:'test', questionTypeId:1, responseTypeId:1, responseSets:[1]}},
      responseSets: {1: {id: 1, name: 'Test'}}
    };
    const component = renderComponent(QuestionShowContainer, props, state);
    expect(component.find("div[id='question_id_1']")).to.exist;
  });
});
