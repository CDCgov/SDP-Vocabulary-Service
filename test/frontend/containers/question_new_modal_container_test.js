import {
  expect,
  renderComponent
} from '../test_helper';
import QuestionModalContainer from '../../../webpack/containers/QuestionModalContainer';
import MockRouter from '../mock_router';

describe('QuestionModalContainer ', () => {
  it('will show question edit modal', () => {
    const props =  {showModal: true,
                    closeQuestionModal:()=>{},
                    route: {id: 1, name: 'test'},
                    router:new MockRouter(),
                    handleSaveQuestionSuccess: ()=>{},
                    saveQuestionSuccess: ()=>{} };
    const component = renderComponent(QuestionModalContainer, props);
    expect(component.find("div[class='modal body modal-body-question']").length).to.exist;
    expect(component.find("input[name='content']").length).to.exist;
  });
});
