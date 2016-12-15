import React, { Component, PropTypes } from 'react';
import moment from 'moment';
export default class CommentForm extends Component {

  render() {
    return (
          <form method="post" action="/comments" onSubmit={data => this.submit(data)}>
            <div className="form-group">
              <label htmlFor="comment">Your Comment</label>
              <textarea ref={(input) => this.comment = input} name="comment[comment]" className="form-control" rows="3"></textarea>
              <input type="hidden" name="comment[parent_id]" value={this.props.parentId}/>
              <input type="hidden" name="comment[commentable_id]" value={this.props.commentable_id}/>
              <input type="hidden" name="comment[commentable_type]" value={this.props.commentable_type}/>
            </div>
            <button type="submit" className="btn btn-default">Send</button>
          </form>
        )
      };

    submit(data){
      data.preventDefault();
      this.props.addComment(this.props.commentable_type, this.props.commentable_id, this.comment.value, this.props.parent_id);
      this.comment.value = "";
    }

}

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    parentId: PropTypes.number,
    commentable_type: PropTypes.string.isRequired,
    commentable_id: PropTypes.number.isRequired
};
