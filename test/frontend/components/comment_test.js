import {
  expect,
  renderComponent
} from '../test_helper';
import Comment from '../../../webpack/components/Comment';


describe('Comment', () => {
  let component;

  beforeEach(() => {
    const comment = {
      id: 1,
      comment: "Is this a question?",
      commentableId: 12,
      commentableType: "Question",
      parentId: null,
      title: null,
      userId: 14,
      createdAt: "2016-12-09T20:54:38.702Z",
      userName: "Billy Jo Cooter",
      children: null
    };
    component = renderComponent(Comment, {
      comment: comment,
      addComment: function() {}
    });
  });

  it('should create comment block', () => {
    expect(component.find("div[class='comment-meta']").length).to.equal(1);
  });
});
