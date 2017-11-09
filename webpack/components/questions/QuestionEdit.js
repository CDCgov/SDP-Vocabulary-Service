import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import values from 'lodash/values';

import { questionProps } from '../../prop-types/question_props';
import currentUserProps from '../../prop-types/current_user_props';

import Errors from '../Errors';
import ModalDialog from '../ModalDialog';
import ResponseSetModal from '../../containers/response_sets/ResponseSetModal';
import ResponseSetDragWidget from '../../containers/response_sets/ResponseSetDragWidget';
import CodedSetTableEditContainer from '../../containers/CodedSetTableEditContainer';
import SearchResultList from '../../components/SearchResultList';

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
    this.unsavedState = false;
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.responseTypeId === null || this.state.responseTypeId === undefined) {
      const sortedRT = this.sortedResponseTypes(nextProps.responseTypes);
      let rtid = sortedRT[0] ? sortedRT[0].id : null;
      this.setState({ responseTypeId: rtid });
    }
    if(nextProps.question && nextProps.question.responseSets && !this.unsavedState && nextProps.question.responseSets !== this.state.linkedResponseSets) {
      this.setState({ linkedResponseSets: nextProps.question.responseSets });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.state.content !== nextState.content ||
        this.state.description !== nextState.description) &&
        (nextState.content.length >= 10 || nextState.description.length >= 10)) {
      this.props.fetchPotentialDuplicateQuestions(nextState.content, nextState.description);
      this.setState({ showPotentialDuplicates: true });
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
      showResponseSetModal: false,
      showPotentialDuplicates: false
    };
  }

  blankQuestionState() {
    return {
      content: '',
      description: '',
      categoryId: null,
      subcategoryId: null,
      versionIndependentId: null,
      version: 1,
      responseTypeId: null,
      conceptsAttributes: [],
      linkedResponseSets: [],
      otherAllowed: false
    };
  }

  copyQuestion() {
    let category = this.props.question.category ? this.props.question.category : this.props.question.category;
    let questionCopy = {content: this.props.question.content,
      description: this.props.question.description,
      otherAllowed: this.props.question.otherAllowed,
      categoryId: category ? category.id : undefined,
      subcategoryId: this.props.question.subcategory ? this.props.question.subcategory.id : undefined,
      responseTypeId: this.props.question.responseType ? this.props.question.responseType.id : undefined};
    questionCopy.conceptsAttributes = filterConcepts(this.props.question.concepts);
    questionCopy.linkedResponseSets = this.props.question.responseSets || [];
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

  stateForExtend() {
    let extendState = this.modalInitialState();
    Object.assign(extendState, this.copyQuestion());
    extendState.version = 1;
    extendState.parentId  = this.props.question.id;
    extendState.oid = '';
    extendState.versionIndependentId = null;
    return extendState;
  }

  render(){
    const {question, categories, responseTypes} = this.props;
    const state = this.state;
    if(!question || !categories || !responseTypes){
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
                      <label className="input-label" htmlFor="categoryId">Category</label>
                      <select className="input-select" name="categoryId" id="categoryId" value={state.categoryId || undefined} onChange={this.handleChange('categoryId')} >
                        <option value=""></option>
                        {categories && values(categories).map((ct) => {
                          return <option key={ct.id} value={ct.id}>{ct.name}</option>;
                        })}
                      </select>
                    </div>
                </div>
                {categories && categories[state.categoryId] && categories[state.categoryId].subcategories && categories[state.categoryId].subcategories.length > 0 &&
                  <div className="row">
                    <div className="col-md-8 question-form-group">
                    </div>
                    <div className="col-md-4 question-form-group">
                      <label className="input-label" htmlFor="subcategoryId">Subcategory</label>
                      <select className="input-select" name="subcategoryId" id="subcategoryId" value={state.subcategoryId || undefined} onChange={this.handleChange('subcategoryId')} >
                        <option value=""></option>
                        {categories[state.categoryId].subcategories.map((s) => {
                          return <option key={s.id} value={s.id}>{s.name}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                }
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
                  <ResponseSetDragWidget handleResponseSetsChange={this.handleResponseSetsChange}
                                         selectedResponseSets={this.state.linkedResponseSets} />
                : ''}
              </div>
              <div>
                { this.state.showPotentialDuplicates && this.props.potentialDuplicates && this.props.potentialDuplicates.hits && this.props.potentialDuplicates.hits.total > 0 &&
                  <SearchResultList searchResults={this.props.potentialDuplicates}
                                    isEditPage={false}
                                    currentUser={this.props.currentUser}
                                    title="Potential Duplicate Questions"/>
                }
              </div>
              <div className="panel-footer">
                <div className="actions form-group">
                  <button type="submit" name="commit" id='submit-question-form' className="btn btn-default" data-disable-with="Save">Save</button>
                  {this.cancelButton()}
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
    this.handleResponseSetsChange(this.state.linkedResponseSets.concat([successResponse.data]));
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
        if (this.props.action === 'new') {
          let stats = Object.assign({}, this.props.stats);
          stats.questionCount = this.props.stats.questionCount + 1;
          stats.myQuestionCount = this.props.stats.myQuestionCount + 1;
          this.props.setStats(stats);
        }
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
            <input className="form-check-input" type="checkbox" name="otherAllowed" id="otherAllowed" checked={this.state.otherAllowed} onChange={() => this.toggleOtherAllowed()} />
          </div>
        </div>
      );
    } else {
      return '';
    }
  }

  handleResponseSetsChange(newResponseSets){
    this.setState({linkedResponseSets: newResponseSets});
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
  categories: PropTypes.object,
  responseTypes: PropTypes.object,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  draftSubmitter: PropTypes.func.isRequired,
  questionSubmitter: PropTypes.func.isRequired,
  handleResponseTypeChange: PropTypes.func,
  fetchPotentialDuplicateQuestions: PropTypes.func,
  potentialDuplicates: PropTypes.object,
  currentUser: currentUserProps
};

export default QuestionEdit;
