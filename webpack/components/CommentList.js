import React, { Component, PropTypes } from 'react';
import Comment from './Comment';

export default class CommentList extends Component {
  render() {
    return (
      <div className="container post-comments">
        <form action="/comments" method="post">
          <input type="hidden" name="comment[commentable_type]" value={this.props.commentable_type}/>
          <input type="hidden" name="comment[commentable_id]" value={this.props.commentable_id}/>
          <div className="form-group">
            <label htmlFor="comment[comment]">Your Comment</label>
            <textarea name="comment[comment]" className="form-control" rows="3"></textarea>
          </div>
          <button type="submit" className="btn btn-default">Send</button>
        </form>
        <div className="comment-group">
          {this.props.comments.map((comment) => {
            // Each List Item Component needs a key attribute for uniqueness:
            // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
            // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
            // the item value
            return <Comment key={comment.id} comment={comment}  />;
          })}
        </div>
      </div>
    );
  }
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(Comment.propTypes.comment).isRequired
};
