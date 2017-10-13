import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isEmpty from 'lodash/isEmpty';

import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
import { addComment, fetchComments} from '../actions/comment';
import currentUserProps from '../prop-types/current_user_props';

class CommentList extends Component {
  componentWillMount() {
    this.props.fetchComments(this.props.commentableType, this.props.commentableId);
  }

  componentDidUpdate(prevProps){
    if(prevProps.commentableId !== this.props.commentableId) {
      this.props.fetchComments(this.props.commentableType, this.props.commentableId);
    }
  }

  render() {
    let loggedIn = !isEmpty(this.props.currentUser);
    return (
      <div className="post-comments">
      {loggedIn && <CommentForm commentableType={this.props.commentableType}
                   commentableId={this.props.commentableId}
                   addComment={this.props.addComment}/>}
        <div className="comment-group">
          {isEmpty(this.props.comments) && !loggedIn ? (<p>No Comments Yet</p>) : (this.renderChildren(loggedIn))}
        </div>
      </div>
    );
  }

  renderChildren(loggedIn) {
    if(this.props.comments){
      return this.props.comments.filter((c) => c.parentId==null).map((comment) => {
        // Each List Item Component needs a key attribute for uniqueness:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
        // the item value
        return <Comment key={comment.id}
                        comment={comment}
                        loggedIn={loggedIn}
                        addComment={this.props.addComment}
                        comments={this.props.comments} />;
      });
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addComment, fetchComments}, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {
    currentUser: state.currentUser,
    comments: state.comments.filter((comment) => comment.commentableId === ownProps.commentableId)
  };
}

CommentList.propTypes = {
  comments: PropTypes.array,
  addComment: PropTypes.func.isRequired,
  commentableId: PropTypes.number.isRequired,
  commentableType: PropTypes.string.isRequired,
  replyToComment: PropTypes.func,
  currentUser: currentUserProps,
  fetchComments: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
