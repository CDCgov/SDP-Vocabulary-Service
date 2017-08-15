import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import values from 'lodash/values';

import { questionProps } from '../../prop-types/question_props';
import { responseSetsProps } from '../../prop-types/response_set_props';

import Errors from '../Errors';
import ModalDialog from '../ModalDialog';
import ResponseSetModal from '../../containers/response_sets/ResponseSetModal';
import ResponseSetDragWidget from '../../containers/response_sets/ResponseSetDragWidget';
import CodedSetTableEditContainer from '../../containers/CodedSetTableEditContainer';


class QuestionEdit extends Component {

  constructor(props) {
    super(props);
    switch(this.props.action) {
      case 'revise':
        this.state = this.stateForRevise();
        break;
      case 'extend':
        this.state = this.stateForExtend();
        break;
      case 'new':
        this.state = this.stateForNew();
        break;
      default:
        this.state = this.stateForRevise();
    }
    this.handleResponseSetsChange = this.handleResponseSetsChange.bind(this);
    this.handleResponseSetSuccess = this.handleResponseSetSuccess.bind(this);
    this.selectedResponseSets = this.selectedResponseSets.bind(this);
    this.unsavedState = false;
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.responseTypeId === null || this.state.responseTypeId === undefined) {
      const sortedRT = this.sortedResponseTypes(nextProps.responseTypes);
      let rtid = sortedRT[0] ? sortedRT[0].id : null;
      this.setState({ responseTypeId: rtid });
    }
  }

  componentDidMount() {
    if(this.props.route && this.props.router){
      this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    }
    this.existingOnBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = this.windowWillUnload.bind(this);
  }

  componentWillUnmount() {
    this.unsavedState = false;
    window.onbeforeunload = this.existingOnBeforeUnload;
    if(this.unbindHook){
      this.unbindHook();
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
      this.props.questionSubmitter(this.state, () => {
        this.unsavedState = false;
        this.props.router.push(this.nextLocation.pathname);
      }, (failureResponse) => {
        this.setState({errors: failureResponse.response.data});
      });
    }
  }

  windowWillUnload() {
    return (this.unsavedState || null);
  }

  modalInitialState() {
    return {
      showWarningModal: false,
      showResponseSetModal: false
    };
  }

  blankQuestionState() {
    return {
      content: '',
      description: '',
      questionTypeId: null,
      versionIndependentId: null,
      version: 1,
      responseTypeId: null,
      conceptsAttributes: [],
      linkedResponseSets: [],
      otherAllowed: false
    };
  }

  copyQuestion() {
    let questionType = this.props.question.category ? this.props.question.category : this.props.question.questionType;
    let questionCopy = {content: this.props.question.content,
      description: this.props.question.description,
      otherAllowed: this.props.question.otherAllowed,
      questionTypeId: questionType ? questionType.id : undefined,
      responseTypeId: this.props.question.responseType ? this.props.question.responseType.id : undefined};
    questionCopy.conceptsAttributes = filterConcepts(this.props.question.concepts);
    questionCopy.linkedResponseSets = this.props.question.responseSets.map((rs) => rs.id);
    return questionCopy;
  }

  stateForRevise() {
    let reviseState = this.modalInitialState();
    Object.assign(reviseState, this.copyQuestion());
    if (this.props.action === 'revise') {
      reviseState.version = this.props.question.version + 1;
    }
    reviseState.versionIndependentId = this.props.question.versionIndependentId;
    reviseState.parentId  = this.props.question.parent ? this.props.question.parent.id : ''; // null is not allowed as a value
    return reviseState;
  }

  stateForNew() {
    let state = this.modalInitialState();
    Object.assign(state, this.blankQuestionState());
    return state;
  }

  //not working because of map => questionType
  stateForExtend() {
    let extendState = this.modalInitialState();
    Object.assign(extendState, this.copyQuestion());
    extendState.version = 1;
    extendState.parentId  = this.props.question.id;
    extendState.oid = '';
    extendState.versionIndependentId = null;
    return extendState;
  }

  selectedResponseSets(linkedResponseSets, allResponseSets) {
    if(linkedResponseSets) {
      return linkedResponseSets.map((r) => allResponseSets[(r.id || r)]).filter((r) => r !== undefined);
    } else {
      return [];
    }
  }

  render(){
    const {question, questionTypes, responseSets, responseTypes} = this.props;
    const state = this.state;
    if(!question || !questionTypes || !responseTypes){
      return (<div>Loading....</div>);
    }
    return (
      <form id="question-edit-form" onSubmit={(e) => this.handleSubmit(e)}>
      <ModalDialog  show ={this.state.showWarningModal}
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
        <ResponseSetModal show={this.state.showResponseSetModal || false}
                          closeModal={() => this.setState({showResponseSetModal: false})}
                          saveResponseSetSuccess={this.handleResponseSetSuccess} />
        <Errors errors={this.state.errors} />
        <div className="row">
          <div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h1 className="panel-title">{`${this.actionWord()} Question`}</h1>
              </div>
              <div className="panel-body">
                <div className="row">
                    <div className="col-md-8 question-form-group">
                      <label className="input-label" htmlFor="content">Question</label>
                      <input className="input-format" placeholder="Question text" type="text" name="content" id="content" defaultValue={state.content} onChange={this.handleChange('content')} />
                    </div>
                    <div className="col-md-4 question-form-group">
                      <label className="input-label" htmlFor="questionTypeId">Category</label>
                      <select className="input-select" name="questionTypeId" id="questionTypeId" value={state.questionTypeId || undefined} onChange={this.handleChange('questionTypeId')} >
                        <option value=""></option>
                        {questionTypes && values(questionTypes).map((qt) => {
                          return <option key={qt.id} value={qt.id}>{qt.name}</option>;
                        })}
                      </select>
                    </div>
                </div>

                <div className="row ">
                  <div className="col-md-8 question-form-group">
                    <label className="input-label" htmlFor="question-description">Description</label>
                    <textarea className="input-format" placeholder="Question description" type="text" name="question-description" id="question-description" defaultValue={state.description} onChange={this.handleChange('description')} />
                  </div>

                <div className="col-md-4 question-form-group">
                  <label className="input-label" htmlFor="responseTypeId">Response Type</label>
                    <select name="responseTypeId" id="responseTypeId" className="input-select" value={state.responseTypeId || undefined} onChange={this.handleResponseTypeChange()} >
                      {this.sortedResponseTypes(this.props.responseTypes).map((rt) => {
                        return (<option key={rt.id} value={rt.id} >{rt.name} - {rt.description}</option>);
                      })}
                    </select>
                  </div>
                </div>
                {this.otherAllowedBox()}
                <div className="row ">
                  <div className="col-md-12 ">
                    <h2 className="tags-table-header"><strong>Tags</strong></h2>
                    <CodedSetTableEditContainer itemWatcher={(r) => this.handleConceptsChange(r)}
                             initialItems={this.state.conceptsAttributes}
                             parentName={'question'}
                             childName={'tag'} />
                  </div>
                </div>
                { this.isChoiceType() ?
                <div className="row response-set-row">
                  <div className="col-md-6 response-set-label">
                    <h2>Response Sets</h2>
                  </div>
                  <div className="col-md-6 response-set-label">
                    <h2>Selected Response Sets</h2>
                    <button className="btn btn-primary add-new-response-set" type="button" id="add-new-response-set" onClick={() => this.setState({showResponseSetModal:true})}>Add New Response Set</button>
                  </div>
                </div>
                : ''}
                { this.isChoiceType() ?
                  <ResponseSetDragWidget responseSets={responseSets}
                                         handleResponseSetsChange={this.handleResponseSetsChange}
                                         selectedResponseSets={this.selectedResponseSets(this.state.linkedResponseSets, this.props.responseSets)} />
                : ''}
                <div className="panel-footer">
                  <div className="actions form-group">
                    <button type="submit" name="commit" id='submit-question-form' className="btn btn-default" data-disable-with="Save">Save</button>
                    {this.cancelButton()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  actionWord() {
    const wordMap = {'new': 'Create', 'revise': 'Revise', 'extend': 'Extend', 'edit': 'Edit Draft of'};
    return wordMap[this.props.action];
  }


  isChoiceType(){
    let rt = values(this.props.responseTypes).find((a) => {
      return a.id == this.state.responseTypeId;
    });
    if(rt && (rt.code == "choice" || rt.code == "open-choice")){
      return true;
    }
  }

  sortedResponseTypes(responseTypes){
    return values(responseTypes).sort((a,b) => {
      if(a.name == b.name ){
        return 0;
      }else if(a.name < b.name){
        return -1;
      }
      return 1;
    });
  }
  cancelButton() {
    if (this.props.question && this.props.question.id) {
      return(<Link className="btn btn-default" to={`/questions/${this.props.question.id}`}>Cancel</Link>);
    }
    return(<Link className="btn btn-default" to='/'>Cancel</Link>);
  }

  handleResponseSetSuccess(successResponse){
    this.handleResponseSetsChange(this.state.linkedResponseSets.map((r) => {
      const rid = r.id || r;
      return {id: rid};
    }).concat([successResponse.data]));
    this.setState({showResponseSetModal: false});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.props.action === 'edit') {
      this.props.draftSubmitter(this.props.id, this.state, (response) => {
        // TODO: Handle when the saving question fails.
        this.unsavedState = false;
        if (response.status === 200) {
          this.props.router.push(`/questions/${response.data.id}`);
        }
      });
    } else {
      this.props.questionSubmitter(this.state, (successResponse) => {
        this.unsavedState = false;
        this.props.router.push(`/questions/${successResponse.data.id}`);
      }, (failureResponse) => {
        this.setState({errors: failureResponse.response.data});
      });
    }
  }

  handleConceptsChange(newConcepts) {
    this.setState({conceptsAttributes: filterConcepts(newConcepts)});
    this.unsavedState = true;
  }

  handleResponseTypeChange() {
    return (event) => {
      this.setState({responseTypeId: event.target.value});
      if (this.props.responseTypes[event.target.value].code !== 'choice') {
        this.setState({otherAllowed: false});
      }
      this.unsavedState = true;
      if(this.props.handleResponseTypeChange){
        this.props.handleResponseTypeChange(this.props.responseTypes[event.target.value]);
      }
    };
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
      this.unsavedState = true;
    };
  }

  toggleOtherAllowed() {
    this.setState({otherAllowed: !this.state.otherAllowed});
  }

  otherAllowedBox() {
    if (this.state.responseTypeId && this.props.responseTypes[this.state.responseTypeId].code === 'choice') {
      return (
        <div className="row">
          <div className="col-md-8" />
          <div className="col-md-4 question-form-group">
            <label className="input-label" htmlFor="otherAllowed">Other Allowed: </label>
            <input className="form-ckeck-input" type="checkbox" name="otherAllowed" id="otherAllowed" checked={this.state.otherAllowed} onChange={() => this.toggleOtherAllowed()} />
          </div>
        </div>
      );
    } else {
      return '';
    }
  }

  handleResponseSetsChange(newResponseSets){
    this.setState({linkedResponseSets: newResponseSets.map((r) => {
      const rid = r.id || r;
      return rid;
    })});
    this.unsavedState = true;
  }
}

function filterConcepts(concepts) {
  if(!concepts){
    return [];
  }
  return concepts.filter((nc) => {
    return (nc.value !=='' ||  nc.codeSystem !== '' || nc.displayName !=='');
  }).map((nc) => {
    return {value: nc.value, codeSystem: nc.codeSystem, displayName: nc.displayName};
  });
}

QuestionEdit.propTypes = {
  id: PropTypes.string,
  route:  PropTypes.object,
  router: PropTypes.object,
  action: PropTypes.string,
  question: questionProps,
  responseSets:  responseSetsProps,
  questionTypes: PropTypes.object,
  responseTypes: PropTypes.object,
  draftSubmitter: PropTypes.func.isRequired,
  questionSubmitter: PropTypes.func.isRequired,
  handleResponseTypeChange: PropTypes.func
};

export default QuestionEdit;
