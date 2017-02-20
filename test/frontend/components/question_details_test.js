import { expect, renderComponent } from '../test_helper';
import QuestionDetails from '../../../webpack/components/QuestionDetails';
import routes from '../mock_routes';

describe('QuestionDetails', () => {
  let component;

  beforeEach(() => {
    const question = {id: 1, content: "Is this a question?", questionType: ""};
    component = renderComponent(QuestionDetails, {question, routes});
  });

  it('should display a question', () => {
    expect(component.find("p").length).to.equal(8);
  });

});
