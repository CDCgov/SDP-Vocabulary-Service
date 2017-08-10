import { expect, renderComponent } from '../../test_helper';
import FormShow from '../../../../webpack/components/forms/FormShow';
import MockRouter from '../../mock_router';

describe('FormQuestionList', () => {
  let component;

  beforeEach(() => {
    const router = new MockRouter();
    const questions = [];
    for (var i = 1; i < 20; i++) {
      questions.push({id: 1, content: `Is your favorite number ${i}?`, status: 'draft', createdById: 1});
    }
    const props  = {
      form: {id: 6, name: "Test Form", questions: [1], versionIndependentId: "F-1", version: 1, formQuestions: questions},
      publishForm: ()=>{},
      deleteForm: ()=>{},
      formSubmitter:  ()=>{},
      router: router,
      currentUser: {id: 1, email: "test@test.com"}
    };
    component = renderComponent(FormShow, props);
  });

  it('should paginate a list of questions', () => {
    expect(component.find(".rc-pagination")).to.exist;
    expect(component.find("a:contains('Is your favorite number 1?')")).to.exist;
    expect(component.find("a:contains('Is your favorite number 10?')")).to.exist;
    expect(component.find("a:contains('Is your favorite number 11?')")).to.not.exist;
    component.find("li[title='2']").simulate('click');
    expect(component.find("a:contains('Is your favorite number 10?')")).to.not.exist;
    expect(component.find("a:contains('Is your favorite number 11?')")).to.exist;
  });

});
