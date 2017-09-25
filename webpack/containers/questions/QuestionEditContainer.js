import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { denormalize } from 'normalizr';
import { questionSchema } from '../../schema';
import { fetchQuestion, saveQuestion, saveDraftQuestion, publishQuestion, deleteQuestion } from '../../actions/questions_actions';
import { fetchPotentialDuplicateQuestions } from '../../actions/search_results_actions';
import QuestionEdit from '../../components/questions/QuestionEdit';
import { questionProps } from '../../prop-types/question_props';
import currentUserProps from '../../prop-types/current_user_props';
import { fetchResponseTypes } from '../../actions/response_type_actions';
import { fetchQuestionTypes } from '../../actions/question_type_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';

const DUPLICATE_QUESTION_CONTEXT = "DUPLICATE_QUESTION_CONTEXT";

class QuestionEditContainer extends Component {
  constructor(props) {
    super(props);
    this.fetchPotentialDuplicateQuestions = this.fetchPotentialDuplicateQuestions.bind(this);
  }

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

  fetchPotentialDuplicateQuestions(content, description) {
    this.props.fetchPotentialDuplicateQuestions(DUPLICATE_QUESTION_CONTEXT, content, description);
  }

  render() {
    if(!this.props.question || !this.props.questionTypes || !this.props.responseTypes){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="container">
        <QuestionEdit id={this.id}
                      action={this.action}
                      question={this.props.question}
                      stats={this.props.stats}
                      setStats={this.props.setStats}
                      draftSubmitter={this.props.saveDraftQuestion}
                      questionSubmitter={this.props.saveQuestion}
                      publishSubmitter ={this.props.publishQuestion}
                      fetchPotentialDuplicateQuestions={this.fetchPotentialDuplicateQuestions}
                      potentialDuplicates={this.props.potentialDuplicates}
                      questionTypes={this.props.questionTypes}
                      responseTypes={this.props.responseTypes}
                      router={this.props.router}
                      route={this.props.route}
                      currentUser={this.props.currentUser} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  if(ownProps.params.qId){
    props.question = denormalize(state.questions[ownProps.params.qId], questionSchema, state);
    if(props.question){
      if(props.question.name) {
        props.question.content = props.question.name;
      }
    }
  }else{
    props.question = {version:1, concepts:[], responseSets:[]};
  }
  props.questionTypes = state.questionTypes;
  props.responseTypes = state.responseTypes;
  props.potentialDuplicates = state.searchResults[DUPLICATE_QUESTION_CONTEXT] || {};
  props.stats = state.stats;
  props.currentUser = state.currentUser;
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchQuestion, saveQuestion, saveDraftQuestion,
    publishQuestion, deleteQuestion, fetchQuestionTypes, fetchResponseTypes,
    setSteps, setStats, fetchPotentialDuplicateQuestions}, dispatch);
}

QuestionEditContainer.propTypes = {
  question: questionProps,
  questionTypes: PropTypes.object,
  responseTypes: PropTypes.object,
  saveQuestion:  PropTypes.func,
  fetchQuestion: PropTypes.func,
  fetchPotentialDuplicateQuestions: PropTypes.func,
  deleteQuestion:  PropTypes.func,
  publishQuestion: PropTypes.func,
  saveDraftQuestion:  PropTypes.func,
  fetchQuestionTypes: PropTypes.func,
  fetchResponseTypes: PropTypes.func,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  params: PropTypes.object.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  potentialDuplicates: PropTypes.object,
  currentUser: currentUserProps
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditContainer);
