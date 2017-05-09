import { expect, renderComponent } from '../test_helper';
import QuestionDetails from '../../../webpack/components/QuestionDetails';

describe('QuestionDetails', () => {
  let component;

  beforeEach(() => {
    const question = {id: 1, concepts: [], content: "Is this a question?", createdBy: { email: "test@test.com" }, questionType: ""};
    const currentUser = {id: 1, email: "test@test.com"};
    const responseSets = [];
    component = renderComponent(QuestionDetails, {question, responseSets, currentUser});
  });

  it('should display a question', () => {
    expect(component.find("h1[class='panel-title']")).to.contain("Details");
  });

});
