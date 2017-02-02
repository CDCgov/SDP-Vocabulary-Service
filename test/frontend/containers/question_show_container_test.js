import {
  expect,
  renderComponent
} from '../test_helper';
import QuestionShowContainer from '../../../webpack/containers/QuestionShowContainer';

describe('QuestionShowContainer ', () => {
  it('will show a question', () => {
    const props = {
      question: {id:1, contents:'test', questionTypeId:1, responseTypeId:1, responseSets:[1]},
      params:{qId: 1},
      router: {}
    }
    const state = {
      questions: {1: {id:1, contents:'test', questionTypeId:1, responseTypeId:1, responseSets:[1]}},
      responseSets: {1: {id: 1, name: 'Test'}}
    }
    const component = renderComponent(QuestionShowContainer, props, state);
    expect(component.find("div[id='concepts-table']")).to.exist;
    expect(component.find("div[class='panel']")).to.exist;
  });
});
