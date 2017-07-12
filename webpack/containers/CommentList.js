import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
import { addComment, fetchComments} from '../actions/comment';

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
    return (
      <div className="post-comments">
      <CommentForm commentableType={this.props.commentableType}
                   commentableId={this.props.commentableId}
                   addComment={this.props.addComment}/>
        <div className="comment-group">
           {this.renderChildren()}
        </div>
      </div>
    );
  }

  renderChildren (){
    if(this.props.comments){
      return this.props.comments.filter((c) => c.parentId==null).map((comment) => {
        // Each List Item Component needs a key attribute for uniqueness:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
        // the item value
        return <Comment key={comment.id}
                        comment={comment}
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
    comments: state.comments.filter((comment) => comment.commentableId === ownProps.commentableId)
  };
}

CommentList.propTypes = {
  comments: PropTypes.array,
  addComment: PropTypes.func.isRequired,
  commentableId: PropTypes.number.isRequired,
  commentableType: PropTypes.string.isRequired,
  replyToComment: PropTypes.func,
  fetchComments: PropTypes.func.isRequired

};

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
