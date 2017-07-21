import React, { Component } from 'react';
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import CommentForm from './CommentForm';

class Comment extends Component {

  render() {
    return (
      <div className="media">
          <div className="media-heading">
            <button className="btn btn-default btn-collapse btn-xs" type="button" data-toggle="collapse" data-target={"#comment_id_"+this.props.comment.id} aria-expanded="false" aria-controls={"comment_id_"+this.props.comment.id} aria-label="collapse">
              <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
            </button>
            <span className="label label-info">{this.props.comment.id}</span>
            {distanceInWordsToNow(parse(this.props.comment.createdAt,''), {addSuffix: true})} by {this.props.comment.userName}
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
                  <a className="" ref={(input) => this.collapse = input}  role="button" data-toggle="collapse" href={"#replyComment_"+this.props.comment.id} aria-expanded="false" aria-controls={"replyComment_"+this.props.comment.id}>reply</a>
                </span>
                <div className="collapse" id={"replyComment_"+this.props.comment.id}>
                 <CommentForm ref={(input) => this.form = input}
                              parentId={this.props.comment.id}
                              commentableType={this.props.comment.commentableType}
                              commentableId={this.props.comment.commentableId}
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
        .filter((c) => c.parentId == this.props.comment.id)
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
  parentId: PropTypes.number,
  commentableId: PropTypes.number.isRequired,
  commentableType: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  title: PropTypes.string,
  userId: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  addComment: PropTypes.func
});

commentType.children = PropTypes.arrayOf(commentType);

Comment.propTypes = {
  comment: commentType,
  addComment: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired
};

export default Comment;
