import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import CommentForm from './CommentForm';

class Comment extends Component {

   constructor(props){
     super(props);
   }

  render() {
    return (
      <div className="media">
          <div className="media-heading">
            <button className="btn btn-default btn-collapse btn-xs" type="button" data-toggle="collapse" data-target={"#comment_id_"+this.props.comment.id} aria-expanded="false" aria-controls="collapseExample">
              <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
            </button>
            <span className="label label-info">{this.props.comment.id}</span>
            {moment(this.props.comment.created_at,'').fromNow()} by {this.props.comment.user_name}
          </div>

          <div className="panel-collapse collapse in" id={"comment_id_"+this.props.comment.id}>
            <div className="media-left">
              <div className="vote-wrap">
    
              </div>
            </div>

            <div className="media-body">
              <p>
                {this.props.comment.comment}
              </p>
              <div className="comment-meta">
                <span>
                  <a className="" ref={(input) => this.collapse = input}  role="button" data-toggle="collapse" href={"#replyComment_"+this.props.comment.id} aria-expanded="false" aria-controls="collapseExample">reply</a>
                </span>
                <div className="collapse" id={"replyComment_"+this.props.comment.id}>
                 <CommentForm ref={(input) => { this.form = input; }}
                              parent_id={this.props.comment.id}
                              commentable_type={this.props.comment.commentable_type}
                              commentable_id={this.props.comment.commentable_id}
                              comments={this.props.comments}
                              addComment={this.props.addComment} />
                </div>
              </div>
              {this.renderChildren()}

            </div>
          </div>
        </div>
    );
  }

  renderChildren() {
    if (this.props.comments) {
      return this.props.comments
        .filter((c) => c.parent_id == this.props.comment.id)
        .map((comment) => {
          return <Comment key = {comment.id}
                          comment = {comment}
                          comments={this.props.comments}
                          addComment = {this.props.addComment} />;
        });
    }
  }
  }



var commentType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  parent_id: PropTypes.number,
  commentable_id: PropTypes.number.isRequired,
  commentable_type: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  title: PropTypes.string,
  user_id: PropTypes.number.isRequired,
  user_name: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  addComment: PropTypes.func
});

commentType.children = PropTypes.arrayOf(commentType);

Comment.propTypes = {
  comment: commentType,
  addComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    comments: state.comments
  };
}

export default connect(mapStateToProps)(Comment);
