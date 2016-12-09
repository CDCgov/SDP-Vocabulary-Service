import { expect, renderComponent } from '../test_helper';
import Comment from '../../../webpack/components/Comment';


describe('Comment', () => {
  let component;

  beforeEach(() => {
    const comment = {id: 1,
                     comment: "Is this a question?",
                     commentable_id: 12,
                     commentable_type: "Question",
                     parent_id: null,
                     title: null,
                     user_id: 14,
                     user_name: "Billy Jo Cooter",
                     children: null};
    component = renderComponent(Comment, {comment});
    console.log(component.toString());
  });

  it('should create comment block', () => {
    expect(component.find("div[class='comment-meta']").length).to.equal(1);
  });
});
