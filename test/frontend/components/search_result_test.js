import { expect, renderComponent } from '../test_helper';
import SearchResult from '../../../webpack/components/SearchResult';

describe('SearchResult', () => {
  let qComponent;
  let rsComponent;
  let orsComponent;
  let sComponent;

  beforeEach(() => {
    const question = {Source: {id: 1, name: "Is this a question?", description: "This is a test question", responseSets: []}};
    const responseSet = {Source: {id: 1, name: "Response Set Name", description: "RS Description", version: 1, questions: []}};
    const oldResponseSet = {Source: {id: 1, name: "Response Set Name", description: "RS Description", version: 1, mostRecent: 3, mostRecentPublished: 2, questions: []}};
    const section = {Source: {id: 1, name: "Section Name", description: "Section Description", questions: []}};
    const currentUser = {id: 1, email: "fake@gmail.com", name: "Fake Test"};

    qComponent = renderComponent(SearchResult, {type: "question", currentUser: currentUser, result: question});
    rsComponent = renderComponent(SearchResult, {type: "response_set", currentUser: currentUser, result: responseSet});
    orsComponent = renderComponent(SearchResult, {type: "response_set", currentUser: currentUser, result: oldResponseSet});
    sComponent = renderComponent(SearchResult, {type: "section", currentUser: currentUser, result: section});

  });

  it('should create multiple search results', () => {
    expect(qComponent.find("div[class='result-description']")).to.contain('test question');
    expect(rsComponent.find("div[class='result-description']")).to.contain('RS');
    expect(sComponent.find("div[class='result-description']")).to.contain('Section');
  });

  it('should properly display version information', () => {
    expect(rsComponent.find("div[class='result-analytics']")).to.contain('version 1');
    expect(orsComponent.find("div[class='result-analytics']")).to.contain('version 1 of 2');
  });
});
