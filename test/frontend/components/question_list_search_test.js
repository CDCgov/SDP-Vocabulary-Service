import { expect, renderComponent } from '../test_helper';
import QuestionListSearch from '../../../webpack/components/QuestionListSearch';

function search(){}

describe('QuestionListSearch', () => {
  let component;

  beforeEach(() => {
    component = renderComponent(QuestionListSearch, {search});
  });

  it('should create a search bar', () => {
    expect(component.find("input[id='search']")).to.exist;
  });

});
