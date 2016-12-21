import React, { Component, PropTypes } from 'react';
export default class CommentForm extends Component {

  render() {
    return (
          <form method="post" action="/comments" onSubmit={data => this.submit(data)}>
            <div className="form-group">
              <label htmlFor={"comment"+this.props.parentId}>Your Comment</label>
              <textarea id={"comment"+this.props.parentId} ref={(input) => this.comment = input} name="comment" className="form-control" rows="3"></textarea>
            </div>
            <button type="submit" className="btn btn-default">Send</button>
          </form>
    );
  }

  submit(data){
    data.preventDefault();
    this.props.addComment(this.props.commentableType, this.props.commentableId, this.comment.value, this.props.parentId);
    this.comment.value = "";
  }

}

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
  parentId: PropTypes.number,
  commentableType: PropTypes.string.isRequired,
  commentableId: PropTypes.number.isRequired
};
