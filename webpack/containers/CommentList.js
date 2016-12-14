import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
import { addComment, replyToComment, fetchComments} from '../actions/comment';
// comments url
// reply to url function
//
class CommentList extends Component {

  componentWillMount() {
    this.props.fetchComments(this.props.commentable_type, this.props.commentable_id);
  }

  render() {
    return (
      <div className="container post-comments">
      <CommentForm commentable_type={this.props.commentable_type}
                   commentable_id={this.props.commentable_id}
                   addComment={this.props.addComment}/>
        <div className="comment-group">
           {this.renderChildren()}
        </div>
      </div>
    );
  }

  renderChildren (){
    const addComment = this.props.addComment;
    console.log(addComment);
    if(this.props.comments){
      return this.props.comments.filter((c) => {return c.parent_id==null}).map((comment) => {
        // Each List Item Component needs a key attribute for uniqueness:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        // In addition, we pass in our item data and a handleOnClick function that executes a callback that passes
        // the item value
        return <Comment key={comment.id}
                        comment={comment}
                        addComment={this.props.addComment}
                        comments={this.props.comments} />;
                      })
      }
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({addComment, fetchComments}, dispatch);
}

function mapStateToProps(state) {
  return {
    comments: state.comments.comments,
    loading: state.comments.loading
  };
}

CommentList.propTypes = {
  comments: PropTypes.array,
  addComment: PropTypes.func.isRequired,
  commentable_id: PropTypes.number.isRequired,
  commentable_type: PropTypes.string.isRequired,
  replyToComment: PropTypes.func,
  fetchComments: PropTypes.func.isRequired

};

export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
