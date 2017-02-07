import React, { Component, PropTypes } from 'react';
import Routes from "../routes";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion, saveQuestion } from '../actions/questions_actions';
import QuestionForm from '../components/QuestionForm';
import { questionProps } from '../prop-types/question_props';
import { responseSetsProps }  from '../prop-types/response_set_props';
import { fetchResponseTypes } from '../actions/response_type_actions';
import { fetchQuestionTypes } from '../actions/question_type_actions';
import { fetchResponseSets }  from '../actions/response_set_actions';
import { getMostRecentResponseSets } from '../selectors/response_set_selectors';

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
        <div>Loading...</div>
      );
    }
    let action = this.props.params.action;
    if (action === undefined) {
      action = 'new';
    }
    return (
      <div className="container">
        <QuestionForm question={this.props.question} questionSubmitter={this.props.saveQuestion} action={action}
                      questionTypes={this.props.questionTypes} responseSets={this.props.responseSets}
                      responseTypes={this.props.responseTypes} routes={Routes} router={this.props.router} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  if(ownProps.params.qId){
    props.question = state.questions[ownProps.params.qId];
  }else{
    props.question = {version:1, concepts:[], responseSets:[]};
  }
  props.questionTypes = state.questionTypes;
  props.responseTypes = state.responseTypes;
  props.responseSets  = getMostRecentResponseSets(state);
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion, saveQuestion, fetchQuestionTypes, fetchResponseTypes, fetchResponseSets}, dispatch);
}

QuestionEditContainer.propTypes = {
  question: questionProps,
  fetchQuestion: PropTypes.func.isRequired,
  questionTypes: PropTypes.object,
  responseTypes: PropTypes.object,
  responseSets: responseSetsProps,
  saveQuestion: PropTypes.func.isRequired,
  fetchQuestionTypes: PropTypes.func.isRequired,
  fetchResponseTypes: PropTypes.func.isRequired,
  fetchResponseSets:  PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditContainer);
