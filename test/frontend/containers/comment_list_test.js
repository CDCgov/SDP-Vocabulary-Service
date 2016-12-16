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
      commentable_id: 12,
      commentable_type: "Question",
      parent_id: null,
      title: null,
      user_id: 14,
      user_name: "Billy Jo Cooter",
      children: null,
      created_at: "2016-12-09T20:54:38.702Z",
    }, {
      id: 2,
      comment: "Is this a question?",
      commentable_id: 12,
      commentable_type: "Question",
      parent_id: null,
      title: null,
      user_id: 16,
      user_name: "Billy Jo Jim Bob",
      children: null,
      created_at: "2016-12-09T20:54:38.702Z",
    }];
    const state = {
      comments: comments
    };
    const props = {
      commentable_id: 12,
      commentable_type: "Question",
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
