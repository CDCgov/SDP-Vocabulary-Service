import { expect, renderComponent } from '../test_helper';
import SearchResult from '../../../webpack/components/SearchResult';

describe('SearchResult', () => {
  let qComponent;
  let rsComponent;
  let fComponent;

  beforeEach(() => {
    const question = {Source: {id: 1, name: "Is this a question?", description: "This is a test question", responseSets: []}};
    const responseSet = {Source: {id: 1, name: "Response Set Name", description: "RS Description", questions: []}};
    const form = {Source: {id: 1, name: "Form Name", description: "Form Description", questions: []}};
    const currentUser = {id: 1, email: "fake@gmail.com", name: "Fake Test"};

    qComponent = renderComponent(SearchResult, {type: "question", currentUser: currentUser, result: question});
    rsComponent = renderComponent(SearchResult, {type: "response_set", currentUser: currentUser, result: responseSet});
    fComponent = renderComponent(SearchResult, {type: "form", currentUser: currentUser, result: form});

  });

  it('should create multiple search results', () => {
    expect(qComponent.find("div[class='search-result-description']")).to.contain('test question');
    expect(rsComponent.find("div[class='search-result-description']")).to.contain('RS');
    expect(fComponent.find("div[class='search-result-description']")).to.contain('Form');
  });
});
