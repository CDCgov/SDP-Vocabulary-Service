import { expect, renderComponent } from '../../test_helper';
import SectionShow from '../../../../webpack/components/sections/SectionShow';
import MockRouter from '../../mock_router';

describe('SectionNestedItemList', () => {
  let component;

  beforeEach(() => {
    const router = new MockRouter();
    const questions = [];
    const sectionNestedItems = [];
    for (var i = 1; i < 20; i++) {
      questions.push({id: i, content: `Is your favorite number ${i}?`, status: 'draft', createdById: 1});
      sectionNestedItems.push({id: i, questionId: i});
    }
    const props  = {
      section: {id: 6, name: "Test Section", questions: questions, versionIndependentId: "SECT-1", version: 1, sectionNestedItems: sectionNestedItems},
      publishSection: ()=>{},
      deleteSection: ()=>{},
      sectionSubmitter:  ()=>{},
      router: router,
      currentUser: {id: 1, email: "test@test.com"}
    };
    component = renderComponent(SectionShow, props);
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
