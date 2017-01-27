import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion } from '../actions/questions_actions';
import QuestionForm from '../components/QuestionForm';
import { questionProps } from '../prop-types/question_props';
import { fetchResponseTypes } from '../actions/response_type_actions';
import { fetchQuestionTypes } from '../actions/question_type_actions';
import { fetchResponseSets } from '../actions/response_set_actions';

class QuestionEditContainer extends Component {
  componentWillMount() {
    if(this.props.params.qId){
      this.props.fetchQuestion(this.props.params.qId);
    }
    this.props.fetchQuestionTypes();
    this.props.fetchResponseTypes();
    this.props.fetchResponseSets();
  }

  render() {
    if(!this.props.question || !this.props.questionTypes || !this.props.responseSets || !this.props.responseTypes){
      return (
        <div>Loading..</div>
      );
    }
    //  Need to add:
    //    - this.props.selectedResponseSets
    //    - this.props.concepts
    //    - this.props.Routes
    //  <QuestionForm question={this.props.question} selectedResponseSets={this.props.selectedResponseSets} responseSets={this.props.responseSets} questionTypes={this.props.questionTypes} responseTypes={this.props.responseTypes} routes={this.props.Routes} concepts={this.props.concepts} />
    return (
      <div className="container">
        Rendered Test:
        <p>{this.props.question.id}</p>
        <p>{this.props.questionTypes[1].id}</p>
        <p>{this.props.responseSets[1].id}</p>
        <p>{this.props.responseTypes[1].id}</p>
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
  props.questionTypes = state.questionTypes;
  props.responseTypes = state.responseTypes;
  props.responseSets = state.responseSets;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion, fetchQuestionTypes, fetchResponseTypes, fetchResponseSets}, dispatch);
}

QuestionEditContainer.propTypes = {
  question: questionProps,
  fetchQuestion: PropTypes.func,
  fetchQuestionTypes: PropTypes.func,
  fetchResponseTypes: PropTypes.func,
  fetchResponseSets: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditContainer);
