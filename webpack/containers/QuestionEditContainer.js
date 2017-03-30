import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion, saveQuestion, saveDraftQuestion, publishQuestion, deleteQuestion } from '../actions/questions_actions';
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
    let id = this.props.params.qId;
    if (action === undefined) {
      action = 'new';
    }
    return (
      <div className="container">
        <QuestionForm id={id}
                      action={action}
                      question={this.props.question}
                      draftSubmitter={this.props.saveDraftQuestion}
                      questionSubmitter={this.props.saveQuestion}
                      publishSubmitter ={this.props.publishQuestion}
                      questionTypes={this.props.questionTypes}
                      responseSets ={this.props.responseSets}
                      responseTypes={this.props.responseTypes}
                      router={this.props.router}
                      route ={this.props.route} />
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
  return bindActionCreators({fetchQuestion, saveQuestion, saveDraftQuestion, publishQuestion, deleteQuestion, fetchQuestionTypes, fetchResponseTypes, fetchResponseSets}, dispatch);
}

QuestionEditContainer.propTypes = {
  question: questionProps,
  responseSets:  responseSetsProps,
  questionTypes: PropTypes.object,
  responseTypes: PropTypes.object,
  saveQuestion:  PropTypes.func,
  fetchQuestion: PropTypes.func,
  deleteQuestion:  PropTypes.func,
  publishQuestion: PropTypes.func,
  saveDraftQuestion:  PropTypes.func,
  fetchResponseSets:  PropTypes.func,
  fetchQuestionTypes: PropTypes.func,
  fetchResponseTypes: PropTypes.func,
  params: PropTypes.object.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditContainer);
