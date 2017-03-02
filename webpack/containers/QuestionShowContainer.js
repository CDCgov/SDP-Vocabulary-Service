import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion, publishQuestion } from '../actions/questions_actions';
import { questionProps } from "../prop-types/question_props";
import QuestionDetails  from '../components/QuestionDetails';
import CommentList from '../containers/CommentList';
import { responseSetProps } from "../prop-types/response_set_props";
import currentUserProps from "../prop-types/current_user_props";

class QuestionShowContainer extends Component {

  componentWillMount() {
    this.props.fetchQuestion(this.props.params.qId);
  }

  componentDidUpdate(prevProps){
    if(prevProps.params.qId !== this.props.params.qId){
      this.props.fetchQuestion(this.props.params.qId);
    }
  }

  publishQuestionButton(){
    if(this.props.currentUser && this.props.currentUser.id && this.props.question ){
      let q = this.props.question;
      if(q.status == 'draft'){
        return( <button className="btn btn-primary" onClick={() => this.handlePublish(q) }>Publish</button> );
      } else if(q.status == 'published'){
        //return( <a className="btn btn-primary" href={`/landing#/questions/${this.props.question.id}/deprecate`}>Deprecate</a> );
      }
    }
  }

  handlePublish(q){
    publishQuestion(q.id, (response) => {
      this.props.fetchQuestion(response.data.id);
    });
  }

  render() {
    if(!this.props.question){
      return null;
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <QuestionDetails question={this.props.question} publishButton={this.publishQuestionButton()} responseSets={this.props.responseSets} currentUser={this.props.currentUser}/>

            <div className="col-md-12 showpage-comments-title">Comments:</div>
            <CommentList commentableType='Question' commentableId={this.props.question.id} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.question = state.questions[ownProps.params.qId];
  props.currentUser = state.currentUser;
  if (props.question && props.question.responseSets) {
    props.responseSets = props.question.responseSets.map((rsId) => state.responseSets[rsId]);
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion}, dispatch);
}

// Avoiding a lint error, but if you supply a question when you create this class, it will be ignored and overwritten!
QuestionShowContainer.propTypes = {
  question: questionProps,
  params:   PropTypes.object,
  currentUser:   currentUserProps,
  responseSets:  PropTypes.arrayOf(responseSetProps),
  fetchQuestion: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionShowContainer);
