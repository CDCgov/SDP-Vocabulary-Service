import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForm, saveForm, newForm, saveDraftForm } from '../actions/form_actions';
import { addQuestion, removeQuestion, reorderQuestion, fetchQuestion, fetchQuestions } from '../actions/questions_actions';
import FormEdit from '../components/FormEdit';
import ResponseSetModal from '../components/ResponseSetModal';
import { fetchResponseSets }   from '../actions/response_set_actions';
import QuestionModalContainer  from './QuestionModalContainer';
import QuestionSearchContainer from './QuestionSearchContainer';
import { formProps } from '../prop-types/form_props';
import { questionProps } from '../prop-types/question_props';
import { responseSetProps } from '../prop-types/response_set_props';
import {Button} from 'react-bootstrap';
import _ from 'lodash';

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
    this.state = {selectedFormSaver: selectedFormSaver, showQuestionModal: false};
    this.closeQuestionModal = this.closeQuestionModal.bind(this);
    this.handleSaveQuestionSuccess = this.handleSaveQuestionSuccess.bind(this);
  }

  componentWillMount() {
    this.props.fetchResponseSets();
    this.props.fetchQuestions();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.formId != this.props.params.formId){
      this.props.fetchForm(this.props.params.formId);
    }
    if(this.props.form && this.props.form.formQuestions) {
      this.refs.form.setState(Object.assign(this.refs.form.state, {formQuestions: this.props.form.formQuestions}));
    }
  }

  closeQuestionModal(){
    this.setState({showQuestionModal: false});
  }

  handleSaveQuestionSuccess(successResponse){
    this.setState({showQuestionModal: false});
    this.props.fetchQuestion(successResponse.data.id);
    this.props.addQuestion(this.props.form, successResponse.data);
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
                                closeQuestionModal ={()=>this.setState({showQuestionModal: false})}
                                handleSaveQuestionSuccess={this.handleSaveQuestionSuccess} />
        <ResponseSetModal show={this.state.showResponseSetModal}
                          closeModal={() => this.setState({showResponseSetModal: false})}
                          saveResponseSetSuccess={() => this.setState({showResponseSetModal: false})} />
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">{_.capitalize(this.props.params.action)} Form </h3>
            </div>
            <div className="panel-body">
              <div className="col-md-3">
                <div className="row add-question">
                  <Button onClick={()=>this.setState({showQuestionModal: true})} bsStyle="primary">Add New Question</Button>
                </div>
                <QuestionSearchContainer allQs={this.props.questions}
                                         allRs={this.props.responseSets}
                                         form ={this.props.form}
                                         reverseSort={true} />
              </div>
              <FormEdit ref='form'
                    form={this.props.form}
                    action={this.props.params.action || 'new'}
                    route ={this.props.route}
                    router={this.props.router}
                    questions={this.props.questions}
                    responseSets ={this.props.responseSets}
                    formSubmitter={this.state.selectedFormSaver}
                    removeQuestion ={this.props.removeQuestion}
                    reorderQuestion={this.props.reorderQuestion}
                    showResponseSetModal={() => this.setState({showResponseSetModal: true})} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSets, addQuestion, fetchQuestions, fetchQuestion,
    newForm, fetchForm, removeQuestion, reorderQuestion,
    saveForm, saveDraftForm}, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {
    form: state.forms[ownProps.params.formId||0],
    questions: _.values(state.questions),
    responseSets: _.values(state.responseSets)
  };
}

FormsEditContainer.propTypes = {
  form:  formProps,
  route: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  questions: PropTypes.arrayOf(questionProps),
  responseSets: PropTypes.arrayOf(responseSetProps),
  newForm:  PropTypes.func,
  saveForm: PropTypes.func,
  fetchForm: PropTypes.func,
  addQuestion: PropTypes.func,
  saveDraftForm: PropTypes.func,
  fetchQuestion: PropTypes.func,
  fetchQuestions: PropTypes.func,
  removeQuestion: PropTypes.func,
  reorderQuestion: PropTypes.func,
  fetchResponseSets: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsEditContainer);
