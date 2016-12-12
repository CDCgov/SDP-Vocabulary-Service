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
      this.props.commentContainer.addComment(this.comment.value);
      this.reset();
    }

   reset(){
     console.log("reset");
     console.log(this.comment);
     this.comment.value = "";
   }
}
