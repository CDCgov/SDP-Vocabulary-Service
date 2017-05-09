import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { formProps } from '../prop-types/form_props';
import { responseSetsProps } from '../prop-types/response_set_props';
import { questionsProps } from '../prop-types/question_props';
import { Button } from 'react-bootstrap';
import QuestionItem from './QuestionItem';
import ModalDialog  from './ModalDialog';
import Errors from './Errors';
import _ from 'lodash';

class FormEdit extends Component {

  stateForRevise(form) {
    var state = this.stateForEdit(form);
    state.version = state.version + 1;
    return state;
  }

  stateForExtend(form) {
    var state = this.stateForEdit(form);
    state.id = null;
    state.versionIndependentId = null;
    state.version = 1;
    state.parentId = form.id;
    state.controlNumber = '';
    return state;
  }

  stateForEdit(form) {
    const id = form.id;
    const versionIndependentId = form.versionIndependentId;
    const version = form.version;
    const name = form.name || '';
    const description = form.description || '';
    const formQuestions = form.formQuestions || [];
    const controlNumber = form.controlNumber;
    const showWarningModal = false;
    const parentId = form.parent ? form.parent.id : '';
    return {formQuestions, name, id, version, versionIndependentId, controlNumber, description, showWarningModal, parentId};
  }

  constructor(props) {
    super(props);
    switch (this.props.action) {
      case 'revise':
        this.state = this.stateForRevise(props.form);
        break;
      case 'extend':
        this.state = this.stateForExtend(props.form);
        break;
      case 'edit':
        this.state = this.stateForEdit(props.form);
        break;
      default:
        this.state = this.stateForRevise({});
    }
    this.unsavedState = false;
    this.lastQuestionCount = this.state.formQuestions.length;
    this.addedResponseSets = _.compact(this.state.formQuestions.map((fq) => fq.responseSetId));
  }

  componentDidMount() {
    this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    window.onbeforeunload = this.windowWillUnload.bind(this);
  }

  componentWillUnmount() {
    this.unsavedState = false;
    this.unbindHook();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.lastQuestionCount !== prevState.formQuestions.length) {
      this.unsavedState = true;
      this.lastQuestionCount = prevState.formQuestions.length;
    }
  }

  routerWillLeave(nextLocation) {
    this.setState({ showWarningModal: this.unsavedState });
    this.nextLocation = nextLocation;
    return !this.unsavedState;
  }

  handleModalResponse(leavePage){
    this.setState({ showWarningModal: false });
    if(leavePage){
      this.unsavedState = false;
      this.props.router.push(this.nextLocation.pathname);
    }else{
      let form = Object.assign({}, this.state);
      form.linkedQuestions = this.state.formQuestions;
      this.props.formSubmitter(form, (response) => {
        // TODO: Handle when the saving form fails.
        this.unsavedState = false;
        if (response.status === 201) {
          this.props.router.push(this.nextLocation.pathname);
        }
      });
    }
  }

  windowWillUnload() {
    return (this.unsavedState || null);
  }

  handleResponseSetChange(questionIndex, responseSetId) {
    if(isNaN(responseSetId)){
      responseSetId = null;
    }
    let newState = Object.assign({}, this.state);
    newState.formQuestions[questionIndex].responseSetId = responseSetId;
    this.setState(newState);
    this.unsavedState = true;
  }

  handleProgramVarChange(questionIndex, programVar) {
    let newState = Object.assign({}, this.state);
    newState.formQuestions[questionIndex].programVar = programVar;
    this.setState(newState);
    this.unsavedState = true;
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
      this.unsavedState = true;
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    // Because of the way we have to pass the current questions in we have to manually sync props and state for submit
    let form = Object.assign({}, this.state);
    form.linkedQuestions = this.state.formQuestions;
    this.props.formSubmitter(form, (response) => {
      this.unsavedState = false;
      this.props.router.push(`/forms/${response.data.id}`);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  cancelButton() {
    if(this.props.form && this.props.form.id) {
      return(<Link className="btn btn-default pull-right" to={`/forms/${this.props.form.id}`}>Cancel</Link>);
    }
    return(<Link className="btn btn-default pull-right" to='/'>Cancel</Link>);
  }

  addLinkedResponseSet(questionIndex, responseSet){
    if(this.state.formQuestions[questionIndex].responseSetId == responseSet.id){
      return;
    }
    this.addedResponseSets = _.union(this.addedResponseSets, [responseSet.id]);
    var newState = Object.assign({}, this.state);
    newState.formQuestions[questionIndex].responseSetId = responseSet.id;
    this.setState(newState);
  }

  linkedResponseSets(qId) {
    var linkedResponseSets = [];
    if(this.props.questions[qId] && this.props.questions[qId].responseSets && this.props.questions[qId].responseSets.length > 0) {
      linkedResponseSets = this.props.questions[qId].responseSets || [];
    }
    linkedResponseSets = _.union(linkedResponseSets, this.addedResponseSets, this.state.formQuestions.map((fq) => fq.responseSetId));
    return _.compact(linkedResponseSets.map((rsId) => this.props.responseSets[rsId]));
  }

  addedQuestions() {
    var form = this.state;
    return (
      <div id="added-questions" aria-label="Added">
        <div className="row">
          <div className="response-set-header">
            <div className="col-md-5 response-set-label"><span><b>Questions</b></span></div>
            <div className="col-md-7 response-set-label">
              <span className="right"><b>Response Sets</b></span>
              <Button onClick={this.props.showResponseSetModal} bsStyle="primary">Add New Response Set</Button>
            </div>
          </div>
        </div>
        <div className="added-question-group">
          {form.formQuestions.map((q, i) =>
            <div className="row" key={i}>
              <div className="col-md-11">
                <QuestionItem index={i}
                              question={this.props.questions[q.questionId]}
                              responseSets={this.linkedResponseSets(q.questionId)}
                              selectedResponseSet={q.responseSetId}
                              programVar={q.programVar}
                              removeQuestion ={this.props.removeQuestion}
                              reorderQuestion={this.props.reorderQuestion}
                              handleProgramVarChange  ={(value) => this.handleProgramVarChange(i, value)}
                              handleResponseSetChange ={(event) => this.handleResponseSetChange(i, parseInt(event.target.value))}
                              handleSelectSearchResult={(responseSet) => {
                                this.addLinkedResponseSet(i, responseSet);
                                this.handleResponseSetChange(i, responseSet.id);
                              }} />
              </div>
              <div className="col-md-1">
                <div className="row form-question-controls">
                  <div className="btn btn-small btn-default move-up"
                       onClick={() => this.props.reorderQuestion(form, i, 1)}>
                    <i title="Move Up" className="fa fa fa-arrow-up"></i>
                  </div>
                </div>
                <div className="row form-question-controls">
                  <div className="btn btn-small btn-default move-down"
                       onClick={() => this.props.reorderQuestion(form, i, -1)}>
                    <i className="fa fa fa-arrow-down" title="Move Down"></i>
                  </div>
                </div>
                <div className="row form-question-controls">
                  <div className="btn btn-small btn-default delete-question"
                       onClick={() => this.props.removeQuestion(form, i)}>
                    <i className="fa fa fa-trash" title="Remove"></i>
                  </div>
                </div>
              </div>
              </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    if(!this.props.questions || !this.props.responseSets){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="col-md-7 form-edit-details">
      <div className="" id='form-div'>
      <ModalDialog show ={this.state.showWarningModal}
                   title="Warning"
                   subTitle="Unsaved Changes"
                   warning={true}
                   message="You are about to leave a page with unsaved changes. How would you like to proceed?"
                   secondaryButtonMessage="Continue Without Saving"
                   primaryButtonMessage="Save & Leave"
                   cancelButtonMessage="Cancel"
                   primaryButtonAction={()=> this.handleModalResponse(false)}
                   cancelButtonAction ={()=> {
                     this.props.router.push(this.props.route.path);
                     this.setState({ showWarningModal: false });
                   }}
                   secondaryButtonAction={()=> this.handleModalResponse(true)} />
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <Errors errors={this.state.errors} />
          <div className="form-inline">
            <button className="btn btn-default btn-sm" disabled><span className="fa fa-navicon"></span><span className="sr-only">Edit Action Menu</span></button>
            <input  className='btn btn-default pull-right' name="Save Form" type="submit" value={`Save`}/>
            <button className="btn btn-default pull-right" disabled>Export</button>
            {this.cancelButton()}
          </div>
        <div className="row">
          <div className="col-md-12">
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="form-group col-md-12">
                <label htmlFor="form-name" hidden>Name</label>
                <input className="input-format" placeholder="Name" type="text" value={this.state.name} name="form-name" id="form-name" onChange={this.handleChange('name')}/>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-8">
                <label htmlFor="form-description">Description</label>
                <input className="input-format" placeholder="Enter a description here..." type="text" value={this.state.description || ''} name="form-description" id="form-description" onChange={this.handleChange('description')}/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="controlNumber">OMB Approval</label>
                <input className="input-format" placeholder="XXXX-XXXX" type="text" value={this.state.controlNumber || ''} name="controlNumber" id="controlNumber" onChange={this.handleChange('controlNumber')}/>
              </div>
            </div>
          </div>
        </div>
        {this.addedQuestions()}
      </form>
      </div>
      </div>
    );
  }
}

FormEdit.propTypes = {
  form:   formProps,
  action: PropTypes.string.isRequired,
  formSubmitter:   PropTypes.func.isRequired,
  reorderQuestion: PropTypes.func.isRequired,
  removeQuestion:  PropTypes.func.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  responseSets: responseSetsProps,
  questions: questionsProps.isRequired,
  showResponseSetModal: PropTypes.func.isRequired
};

export default FormEdit;
