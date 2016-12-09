import { expect, renderComponent } from '../test_helper';
import CommentList from '../../../webpack/components/CommentList';


describe('CommentList', () => {
  let component;

  beforeEach(() => {
    const comments = [{id: 1,
                     comment: "Is this a question?",
                     commentable_id: 12,
                     commentable_type: "Question",
                     parent_id: null,
                     title: null,
                     user_id: 14,
                     user_name: "Billy Jo Cooter",
                     children: null},
                     {id: 2,
                      comment: "Is this a question?",
                      commentable_id: 12,
                      commentable_type: "Question",
                      parent_id: null,
                      title: null,
                      user_id: 16,
                      user_name: "Billy Jo Jim Bob",
                      children: null}
                   ];
    component = renderComponent(CommentList, {comments});
  });

  it('should create comment block', () => {
    expect(component.find("div[class='media']").length).to.equal(2);
  });
});
