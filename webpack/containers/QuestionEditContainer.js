import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion } from '../actions/questions_actions';
import QuestionForm from '../components/QuestionForm';
import { questionProps } from '../prop-types/question_props';
import { fetchResponseTypes } from '../actions/response_type_actions';
import { fetchQuestionTypes } from '../actions/question_type_actions';

class QuestionEditContainer extends Component {
  componentWillMount() {
    if(this.props.params.qId){
      this.props.fetchQuestion(this.props.params.qId);
    }
    this.props.fetchQuestionTypes();
    this.props.fetchResponseTypes();
  }

  render() {
    if(!this.props.question){
      return (
        <div>Loading..</div>
      );
    }
    //  <QuestionForm question={this.props.question} questionSubmitter={() => {}} />
    return (
      <div className="container">
        Rendered Test.
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  if(ownProps.params.qId){
    props.question = state.questions[ownProps.params.qId];
  } else {
    props.question = { version: 1 };
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion, fetchQuestionTypes, fetchResponseTypes}, dispatch);
}

QuestionEditContainer.propTypes = {
  question: questionProps,
  fetchQuestion: PropTypes.func,
  fetchQuestionTypes: PropTypes.func,
  fetchResponseTypes: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditContainer);
