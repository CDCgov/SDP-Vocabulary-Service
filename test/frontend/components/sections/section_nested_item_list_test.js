import { expect, renderComponent } from '../../test_helper';
import SectionNestedItemList from '../../../../webpack/containers/sections/SectionNestedItemList';

describe('SectionNestedItemList', () => {
  let component;

  beforeEach(() => {
    const items = [{id: 1, content: "Is this a question?", category: "", createdById: 1},
                       {id: 2, content: "Whats your name", category: "", createdById: 1},
                       {id: 3, content: "What is a question?", category: "", createdById: 1}];
    const currentUser = {id: 1};
    component = renderComponent(SectionNestedItemList, {items, currentUser});
  });

  it('should create list of questions', () => {
    expect(component.find("div[class='result-description']").length).to.equal(3);
  });

});
