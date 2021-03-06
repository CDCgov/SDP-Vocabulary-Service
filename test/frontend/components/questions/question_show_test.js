import { expect, renderComponent } from '../../test_helper';
import QuestionShow from '../../../../webpack/components/questions/QuestionShow';

describe('QuestionShow', () => {
  let component;

  beforeEach(() => {
    const question = {id: 1, concepts: [], content: "Is this a question?", createdBy: { email: "test@test.com" }, category: ""};
    const currentUser = {id: 1, email: "test@test.com"};
    const responseSets = [];
    const addBreadcrumbItem = () => {};
    component = renderComponent(QuestionShow, {question, responseSets, currentUser, addBreadcrumbItem});
  });

  it('should display a question', () => {
    expect(component.find("h2[class='panel-title']")).to.contain("Details");
  });

});
