import React, { Component, PropTypes } from 'react';
export default class CommentForm extends Component {

  render() {
    return (
          <form method="post" action="/comments" onSubmit={data => this.submit(data)}>
            <div className="form-group">
              <label htmlFor={"comment"+this.props.parent_id}>Your Comment</label>
              <textarea id={"comment"+this.props.parent_id} ref={(input) => this.comment = input} name="comment" className="form-control" rows="3"></textarea>
            </div>
            <button type="submit" className="btn btn-default">Send</button>
          </form>
        );
      }

    submit(data){
      data.preventDefault();
      this.props.addComment(this.props.commentable_type, this.props.commentable_id, this.comment.value, this.props.parent_id);
      this.comment.value = "";
    }

}

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    parent_id: PropTypes.number,
    commentable_type: PropTypes.string.isRequired,
    commentable_id: PropTypes.number.isRequired
};
