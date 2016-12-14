import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import CommentForm from './CommentForm'
import { addComment, replyToComment, fetchComments} from '../actions/comment';

class Comment extends Component {

   constructor(props){
     super(props)
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
                <div className="vote up">
                  <i className="glyphicon glyphicon-menu-up"></i>
                </div>
                <div className="vote inactive">
                  <i className="glyphicon glyphicon-menu-down"></i>
                </div>
              </div>
            </div>

            <div className="media-body">
              <p>
                {this.props.comment.comment}
              </p>
              <div className="comment-meta">
                <span><a href="#">delete</a></span>
                <span><a href="#">report</a></span>
                <span><a href="#">hide</a></span>
                <span>
                  <a className="" ref={(input) => {this.collapse = input}}  role="button" data-toggle="collapse" href={"#replyComment_"+this.props.comment.id} aria-expanded="false" aria-controls="collapseExample">reply</a>
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

  renderChildren (){
    const addComment = this.props.addComment;
    console.log(addComment);
    if(this.props.comments){
      return this.props.comments.filter((c) => {
          return c.parent_id==this.props.comment.id}).map((comment) => {
        // Each List Item Component needs a key attribute for uniqueness:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
        // the item value
        return <Comment key={comment.id}
                        comment={comment}
                        addComment={this.props.addComment} />;
                      })
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
  addComment: PropTypes.func.isRequired
});

commentType.children = PropTypes.arrayOf(commentType);

Comment.propTypes = {
  comment: commentType
};

function mapStateToProps(state) {
  return {
    comments: state.comments.comments
  };
}

export default connect(mapStateToProps)(Comment);
