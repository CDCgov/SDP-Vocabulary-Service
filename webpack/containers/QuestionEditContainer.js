import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion, saveQuestion, saveDraftQuestion, publishQuestion, deleteQuestion } from '../actions/questions_actions';
import QuestionForm from '../components/QuestionForm';
import { questionProps } from '../prop-types/question_props';
import { responseSetsProps }  from '../prop-types/response_set_props';
import { fetchResponseTypes } from '../actions/response_type_actions';
import { fetchQuestionTypes } from '../actions/question_type_actions';
import { setSteps } from '../actions/tutorial_actions';

class QuestionEditContainer extends Component {
  componentWillMount() {
    if(this.props.params.qId){
      this.props.fetchQuestion(this.props.params.qId);
    }
    this.action = this.props.params.action;
    this.id = this.props.params.qId;
    if (this.props.params.action === undefined) {
      this.action = 'new';
    }

    this.props.fetchQuestionTypes();
    this.props.fetchResponseTypes();
  }

  componentDidMount() {
    this.props.setSteps([
      {
        title: 'Help',
        text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
        selector: '.help-link',
        position: 'bottom',
      },
      {
        title: 'Question Details',
        text: 'Use the input fields to edit content of the question. If the response type is open choice this panel will also give you the option to associate response sets with this quesiton at creation time.',
        selector: '.panel-default',
        position: 'right',
      },
      {
        title: 'Find Tags',
        text: 'Click the search icon to search for and add tags to the question.',
        selector: '.fa-search',
        position: 'right',
      },
      {
        title: 'Create Your Own Tags',
        text: 'Alternatively, you can manually add a tag - click the plus sign to add additional tags to associate with the question.',
        selector: '.fa-plus',
        position: 'top',
      },
      {
        title: 'Create Your Own Tags (Name)',
        text: 'The Display Name field is what the user will see on the page.',
        selector: '.display-name-column',
        position: 'top',
      },
      {
        title: 'Create Your Own Tags (Code)',
        text: 'Optionally, you can enter a code and a code system for the tag you are adding if it belongs to an external system (such as LOINC or SNOWMED).',
        selector: '.code-system-column',
        position: 'top',
      },
      {
        title: 'Action Buttons',
        text: 'Click save to save a draft of the edited content.',
        selector: '.panel-footer',
        position: 'top',
      }]);
  }

  render() {
    if(!this.props.question || !this.props.questionTypes || !this.props.responseSets || !this.props.responseTypes){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="container">
        <QuestionForm id={this.id}
                      action={this.action}
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
  props.responseSets  = state.responseSets;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion, saveQuestion, saveDraftQuestion, publishQuestion, deleteQuestion, fetchQuestionTypes, fetchResponseTypes, setSteps}, dispatch);
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
  fetchQuestionTypes: PropTypes.func,
  fetchResponseTypes: PropTypes.func,
  setSteps: PropTypes.func,
  params: PropTypes.object.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditContainer);
