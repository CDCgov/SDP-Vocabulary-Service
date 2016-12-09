import React, { Component, PropTypes } from 'react';
import moment from 'moment';
export default class Comment extends Component {

  reply (){

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
                  <a className="" role="button" data-toggle="collapse" href="#replyCommentThree" aria-expanded="false" aria-controls="collapseExample">reply</a>
                </span>
                <div className="collapse" id="replyCommentThree">
                  <form>
                    <div className="form-group">
                      <label htmlFor="comment">Your Comment</label>
                      <textarea name="comment" className="form-control" rows="3"></textarea>
                      <input type="hidden" name="comment[parent_id]" value={this.props.comment.id}/>
                      <input type="hidden" name="comment[commentable_id]" value={this.props.comment.commentable_id}/>
                      <input type="hidden" name="comment[commentable_type]" value={this.props.comment.commentable_type}/>
                    </div>
                    <button type="submit" className="btn btn-default">Send</button>
                  </form>
                </div>
              </div>
              {(this.props.comment.children || []).map((childComment) => {
                // Each List Item Component needs a key attribute for uniqueness:
                // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
                // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
                // the item value
                return <Comment key={childComment.id} comment={childComment}  />;
              })}

            </div>
          </div>
        </div>
    );
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
  updated_at: PropTypes.string.isRequired
});

commentType.children = PropTypes.arrayOf(commentType);
Comment.propTypes = {
  comment: commentType
};
