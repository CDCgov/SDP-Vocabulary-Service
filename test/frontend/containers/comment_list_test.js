import {
  expect,
  renderComponent
} from '../test_helper';
import CommentList from '../../../webpack/containers/CommentList';


describe('CommentList', () => {
  it('will show a list of comments', () => {
    const comments = [{
      id: 1,
      comment: "Is this a question?",
      commentableId: 12,
      commentable_type: "Question",
      parentId: null,
      title: null,
      userId: 14,
      userName: "Billy Jo Cooter",
      children: null,
      createdAt: "2016-12-09T20:54:38.702Z",
    }, {
      id: 2,
      comment: "Is this a question?",
      commentableId: 12,
      commentableType: "Question",
      parentId: null,
      title: null,
      userId: 16,
      userName: "Billy Jo Jim Bob",
      children: null,
      createdAt: "2016-12-09T20:54:38.702Z",
    }];
    const state = {
      comments: comments
    };
    const props = {
      commentableId: 12,
      commentableType: "Question",
      comments: comments
    };
    const component = renderComponent(CommentList, props, state);
    expect(component.find("div[class='media']").length).to.equal(2);
  });
});

// import { expect, renderComponent } from '../test_helper';
// import FormsQuestionList from '../../../webpack/containers/FormsQuestionList';
//
//
// describe('FormsQuestionList', () => {
//   it('will show a list of questions', () => {
//     const state = {questions: [{id: 1, content: 'What is the meaning of life?'}, {id: 2, content: 'Is this a test?'}]};
//     const props = {responseSets: [{id: 1, name: 'Response Set 1'}]};
//     const component = renderComponent(FormsQuestionList, props, state);
//     expect(component.find("div:contains('What is the meaning of life?')")).to.exist;
//     expect(component.find("div:contains('Is this a test?')")).to.exist;
//   });
// });
