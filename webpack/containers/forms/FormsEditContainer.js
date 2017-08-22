import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { denormalize } from 'normalizr';
import { Button } from 'react-bootstrap';
import capitalize from 'lodash/capitalize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formSchema } from '../../schema';
import { setSteps } from '../../actions/tutorial_actions';
import { fetchForm, saveForm, newForm, saveDraftForm } from '../../actions/form_actions';
import { addQuestion, removeQuestion, reorderQuestion, fetchQuestion } from '../../actions/questions_actions';
import FormEdit from '../../components/forms/FormEdit';
import ResponseSetModal from '../response_sets/ResponseSetModal';
import QuestionModalContainer  from '../questions/QuestionModalContainer';
import QuestionSearchContainer from '../questions/QuestionSearchContainer';
import { formProps } from '../../prop-types/form_props';
import { questionsProps } from '../../prop-types/question_props';
import { responseSetsProps } from '../../prop-types/response_set_props';


class FormsEditContainer extends Component {

  constructor(props) {
    super(props);
    let selectedFormSaver = this.props.saveForm;
    if (this.props.params.formId) {
      this.props.fetchForm(this.props.params.formId);
      if (this.props.params.action === 'edit') {
        selectedFormSaver = this.props.saveDraftForm;
      }
    } else {
      this.props.newForm();
      this.props.params.formId = 0;
      this.props.params.action = 'new';
    }
    this.state = {selectedFormSaver: selectedFormSaver, showQuestionModal: false, showResponseSetModal: false};
    this.showQuestionModal  = this.showQuestionModal.bind(this);
    this.closeQuestionModal = this.closeQuestionModal.bind(this);
    this.showResponseSetModal  = this.showResponseSetModal.bind(this);
    this.closeResponseSetModal = this.closeResponseSetModal.bind(this);
    this.handleSelectSearchResult  = this.handleSelectSearchResult.bind(this);
    this.handleSaveQuestionSuccess = this.handleSaveQuestionSuccess.bind(this);
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
        title: 'Author Question For Form',
        text: 'If you need to create a new question without leaving the the form use this button to author a new question from scratch.',
        selector: '.add-question',
        position: 'right',
      },
      {
        title: 'Question Search',
        text: 'Type in your search keywords here to search for questions to add to the form.',
        selector: '.search-group',
        position: 'right',
      },
      {
        title: 'Advanced Search Filters',
        text: 'Click Advanced to see additional filters you can apply to your search.',
        selector: '.adv-search-link',
        position: 'right',
      },
      {
        title: 'Question Result',
        text: 'Use these search results to find the question you want to add.',
        selector: '.u-result',
        position: 'right',
      },
      {
        title: 'Add Question',
        text: 'Click on the add button to select a question for the form.',
        selector: '.fa-plus-square',
        position: 'right',
      },
      {
        title: 'Form Details',
        text: 'Edit the various form details on the right side of the page. Select save in the top right of the page when done editing to save a draft of the content.',
        selector: '.form-edit-details',
        position: 'left',
      }]);
  }

  componentDidUpdate(prevProps) {
    if(this.props.params.formId && prevProps.params.formId != this.props.params.formId){
      this.props.fetchForm(this.props.params.formId);
    }
    if(this.props.form && this.props.form.formQuestions) {
      this.refs.form.updateFormQuestions(this.props.form.formQuestions);
    }
  }

  showQuestionModal(){
    this.setState({showQuestionModal: true});
  }

  closeQuestionModal(){
    this.setState({showQuestionModal: false});
  }

  showResponseSetModal(){
    this.setState({showResponseSetModal: true});
  }

  closeResponseSetModal(){
    this.setState({showResponseSetModal: false});
  }

  handleSaveQuestionSuccess(successResponse){
    this.setState({showQuestionModal: false});
    this.props.fetchQuestion(successResponse.data.id);
    this.props.addQuestion(this.props.form, successResponse.data);
  }

  handleSelectSearchResult(q){
    this.props.addQuestion(this.props.form, q);
  }

  render() {
    if(!this.props.form || !this.props.questions){
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div className="form-edit-container">
        <QuestionModalContainer route ={this.props.route}
                                router={this.props.router}
                                showModal={this.state.showQuestionModal}
                                closeQuestionModal ={this.closeQuestionModal}
                                handleSaveQuestionSuccess={this.handleSaveQuestionSuccess} />
        <ResponseSetModal show={this.state.showResponseSetModal}
                          router={this.props.router}
                          closeModal={this.closeResponseSetModal}
                          saveResponseSetSuccess={this.closeResponseSetModal} />
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">{capitalize(this.props.params.action)} Form </h1>
            </div>
            <div className="panel-body">
              <div className="col-md-5">
                <div className="row add-question">
                  <Button tabIndex="4" onClick={this.showQuestionModal} bsStyle="primary">Add New Question</Button>
                </div>
                <QuestionSearchContainer selectedSearchResults={this.props.selectedSearchResults}
                                         handleSelectSearchResult={this.handleSelectSearchResult} />
              </div>
              <FormEdit ref ='form'
                        form={this.props.form}
                        route ={this.props.route}
                        router={this.props.router}
                        action={this.props.params.action || 'new'}
                        questions={this.props.questions}
                        responseSets ={this.props.responseSets}
                        formSubmitter={this.state.selectedFormSaver}
                        removeQuestion ={this.props.removeQuestion}
                        reorderQuestion={this.props.reorderQuestion}
                        showResponseSetModal={this.showResponseSetModal} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, addQuestion, fetchQuestion,
    newForm, fetchForm, removeQuestion, reorderQuestion,
    saveForm, saveDraftForm}, dispatch);
}

function mapStateToProps(state, ownProps) {
  const form = denormalize(state.forms[ownProps.params.formId || 0], formSchema, state);
  var selectedSearchResults = {};
  if(form && form.formQuestions){
    form.formQuestions.map((fq)=>{
      selectedSearchResults[fq.questionId] = true;
    });
  }
  return {
    form: form,
    questions: state.questions,
    responseSets: state.responseSets,
    selectedSearchResults: selectedSearchResults
  };
}

FormsEditContainer.propTypes = {
  form:  formProps,
  route: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  questions: questionsProps,
  responseSets: responseSetsProps,
  setSteps: PropTypes.func,
  newForm:  PropTypes.func,
  saveForm: PropTypes.func,
  fetchForm: PropTypes.func,
  addQuestion: PropTypes.func,
  saveDraftForm: PropTypes.func,
  fetchQuestion: PropTypes.func,
  removeQuestion: PropTypes.func,
  reorderQuestion: PropTypes.func,
  selectedSearchResults: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsEditContainer);
