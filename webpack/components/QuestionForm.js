import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Errors from './Errors';
import { questionProps } from '../prop-types/question_props';
import { responseSetsProps } from '../prop-types/response_set_props';
import ModalDialog from './ModalDialog';
import ResponseSetDragWidget from './ResponseSetDragWidget';
import CodedSetTableEditContainer from '../containers/CodedSetTableEditContainer';
import _ from 'lodash';

class QuestionForm extends Component{

  constructor(props) {
    super(props);
    switch(this.props.action) {
      case 'revise':
        this.state = this.stateForRevise(this.props.question);
        break;
      case 'extend':
        this.state = this.stateForExtend(this.props.question);
        break;
      case 'new':
        this.state = this.stateForNew();
        break;
      default:
        this.state = this.stateForRevise(this.props.question);
    }
    this.handleResponseSetsChange = this.handleResponseSetsChange.bind(this);
    this.unsavedState = false;
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
    this.setState({ showModal: this.unsavedState });
    this.nextLocation = nextLocation;
    return !this.unsavedState;
  }

  handleModalResponse(leavePage){
    this.setState({ showModal: false });
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

  stateForRevise(question) {
    var reviseState = {};
    _.forOwn(this.stateForNew(), (v, k) => reviseState[k] = question[k] || v);
    reviseState.conceptsAttributes = filterConcepts(question.concepts);
    reviseState.linkedResponseSets = question.responseSets;
    if (this.props.action === 'revise') {
      reviseState.version += 1;
    }
    reviseState.parentId  = question.parent ? question.parent.id : null;
    return reviseState;
  }

  stateForNew() {
    return {
      content: '',
      description: '',
      questionTypeId: null,
      versionIndependentId: null,
      version: 1,
      harmonized: false,
      responseTypeId: null,
      conceptsAttributes: [],
      linkedResponseSets: [],
      showModal: false
    };
  }
  //not working because of map => questionType
  stateForExtend(question) {
    var extendState = {};
    _.forOwn(this.stateForNew(), (v, k) => extendState[k] = question[k] || v);
    extendState.conceptsAttributes = filterConcepts(question.concepts);
    extendState.linkedResponseSets = question.responseSets;
    extendState.version = 1;
    extendState.parentId  = question.id;
    extendState.oid = '';
    extendState.harmonized = false;
    extendState.versionIndependentId = null;
    return extendState;
  }

  render(){
    const {question, questionTypes, responseSets, responseTypes} = this.props;
    const state = this.state;
    if(!question || !questionTypes || !responseSets || !responseTypes){
      return (<div>Loading....</div>);
    }

    return (
      <form id="question-edit-form" onSubmit={(e) => this.handleSubmit(e)}>
      <ModalDialog  show={this.state.showModal}
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
                      this.setState({ showModal: false });
                    }}
                    secondaryButtonAction={()=> this.handleModalResponse(true)} />
        <Errors errors={this.state.errors} />
        <div className="row">
          <div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">{`${this.actionWord()} Question`}</h3>
              </div>
              <div className="panel-body">
              <div className="row">
                  <div className="col-md-8 question-form-group">
                      <label className="input-label" htmlFor="content">Question</label>
                      <input className="input-format" placeholder="Question text" type="text" name="content" id="content" defaultValue={state.content} onChange={this.handleChange('content')} />
                  </div>

                  <div className="col-md-4 question-form-group">
                      <label className="input-label" htmlFor="questionTypeId">Category</label>
                      <select className="input-format" name="questionTypeId" id="questionTypeId" defaultValue={state.questionTypeId} onChange={this.handleChange('questionTypeId')} >
                        <option value=""></option>
                        {questionTypes && _.values(questionTypes).map((qt) => {
                          return <option key={qt.id} value={qt.id}>{qt.name}</option>;
                        })}
                      </select>
                  </div>
              </div>

              <div className="row ">
                <div className="col-md-8 question-form-group">
                  <label className="input-label" htmlFor="description">Description</label>
                  <textarea className="input-format" placeholder="Question description" type="text" name="question_description" id="description" defaultValue={state.description} onChange={this.handleChange('description')} />
                </div>
                <div className="col-md-4 question-form-group">
                  <label className="input-label" htmlFor="responseTypeId">Primary Response Type</label>
                    <select name="responseTypeId" id="responseTypeId" className="input-format" defaultValue={state.responseTypeId} onChange={this.handleChange('responseTypeId')} >
                      {_.values(responseTypes).map((rt) => {
                        return (<option key={rt.id} value={rt.id}>{rt.name} - {rt.description}</option>);
                      })}
                    </select>
                </div>
                <div className="col-md-4 question-form-group harmonized-group">
                  <label className="input-label" htmlFor="harmonized">Harmonized: </label>
                  <input className="form-ckeck-input" type="checkbox" name="harmonized" id="harmonized" checked={state.harmonized} onChange={() => this.toggleHarmonized()} />
                </div>


              </div>

              <div className="row ">
                <div className="col-md-12 ">
                    <label className="input-label" htmlFor="concept_id">Concepts</label>
                    <CodedSetTableEditContainer itemWatcher={(r) => this.handleConceptsChange(r)}
                             initialItems={this.state.conceptsAttributes}
                             parentName={'question'}
                             childName={'concept'} />
                </div>
              </div>

              <ResponseSetDragWidget responseSets={responseSets}
                                     handleResponseSetsChange={this.handleResponseSetsChange}
                                     selectedResponseSets={question.responseSets && question.responseSets.map((id) => this.props.responseSets[id])} />

              <div className="panel-footer">
                <div className="actions form-group">
                  <button type="submit" name="commit" id='submit-question-form' className="btn btn-default" data-disable-with={`${this.actionWord()} Question`}>{`${this.actionWord()} Question`}</button>
                  {this.publishButton()}
                  {this.deleteButton()}
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

  cancelButton() {
    if (this.props.question && this.props.question.id) {
      return(<Link className="btn btn-default" to={`/questions/${this.props.question.id}`}>Cancel</Link>);
    }
    return(<Link className="btn btn-default" to='/questions/'>Cancel</Link>);
  }

  publishButton() {
    if (this.props.action === 'edit') {
      return (
        <button name="publish" className="btn btn-default" data-disable-with='Publish' onClick={() => this.handlePublish()}>Publish</button>
      );
    }
  }

  deleteButton() {
    if (this.props.action === 'edit') {
      return (
        <button name="delete" className="btn btn-default" data-disable-with='Delete' onClick={(e) => this.handleDelete(e)}>Delete</button>
      );
    }
  }

  handlePublish() {
    this.props.publishSubmitter(this.props.id, (response) => {
      if (response.status == 200) {
        this.props.router.push(`/questions/${response.data.id}`);
      }
    });
  }

  handleDelete(e) {
    e.preventDefault();
    this.props.deleteSubmitter(this.props.id, (response) => {
      if (response.status == 200) {
        this.props.router.push(`/questions`);
      }
    });
  }

  actionWord() {
    const wordMap = {'new': 'Create', 'revise': 'Revise', 'extend': 'Extend', 'edit': 'Edit Draft of'};
    return wordMap[this.props.action];
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

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
      this.unsavedState = true;
    };
  }

  toggleHarmonized() {
    this.setState({harmonized: !this.state.harmonized});
  }

  handleResponseSetsChange(newResponseSets){
    this.setState({linkedResponseSets: newResponseSets.map((r)=> r.id)});
    this.unsavedState = true;
  }
}

function filterConcepts(concepts) {
  if(!concepts){
    return [];
  }
  return concepts.filter((nc)=>{
    return (nc.value!=='' ||  nc.codeSystem !== '' || nc.displayName !=='');
  }).map((nc) => {
    return {value: nc.value, codeSystem: nc.codeSystem, displayName: nc.displayName};
  });
}

QuestionForm.propTypes = {
  id: PropTypes.string,
  route:  PropTypes.object,
  router: PropTypes.object,
  action: PropTypes.string,
  question: questionProps,
  responseSets: responseSetsProps,
  questionTypes: PropTypes.object,
  responseTypes: PropTypes.object,
  draftSubmitter: PropTypes.func.isRequired,
  deleteSubmitter: PropTypes.func.isRequired,
  publishSubmitter: PropTypes.func.isRequired,
  questionSubmitter: PropTypes.func.isRequired,
};

export default QuestionForm;
