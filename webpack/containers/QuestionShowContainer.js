import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion } from '../actions/questions_actions';
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

  render() {
    if(!this.props.question){
      return null;
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <QuestionDetails question={this.props.question} responseSets={this.props.responseSets} currentUser={this.props.currentUser}/>
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
