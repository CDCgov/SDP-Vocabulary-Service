import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
import { addComment, replyToComment , submitCommentForm} from '../actions/comment';
// comments url
// reply to url function
//
export default class CommentList extends Component {

  addComment(data){
    console.log("addComment");
    console.log(data);
    this.props.comments.push({id: (Math.floor(1000 * Math.random()))  % 1000,
      comment: data,
      commentable_id: this.props.commentable_id,
      commentable_type: this.props.commentable_type,
      created_at: new Date(),
      user_id: 12,
      user_name: "Holy Moly"
  });
    this.setState(this.state);
  };

  render() {
    return (
      <div className="container post-comments">
      <CommentForm commentable_type={this.props.commentable_type}
                   commentable_id={this.props.commentable_id}
                   commentContainer={this}/>
        <div className="comment-group">
          {this.props.comments.map((comment) => {
            // Each List Item Component needs a key attribute for uniqueness:
            // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
            // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
            // the item value
            return <Comment key={comment.id} comment={comment} replyToComment={this.props.replyToComment} />;
          })}
        </div>
      </div>
    );
  }
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(Comment.propTypes.comment).isRequired
};
