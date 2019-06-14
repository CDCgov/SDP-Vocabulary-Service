import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import values from 'lodash/values';
import $ from 'jquery';
import { Row, Col, Button } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';

import { questionProps } from '../../prop-types/question_props';
import currentUserProps from '../../prop-types/current_user_props';

import Errors from '../Errors';
import ModalDialog from '../ModalDialog';

import ResponseSetModal from '../../containers/response_sets/ResponseSetModal';
import ResponseSetDragWidget from '../../containers/response_sets/ResponseSetDragWidget';
import CodedSetTableEditContainer from '../../containers/CodedSetTableEditContainer';
import SearchResultList from '../../components/SearchResultList';
import DataCollectionSelect from '../DataCollectionSelect';
import InfoModal from '../InfoModal';
import InfoModalBodyContent from '../../components/InfoModalBodyContent';

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
    this.handleDataCollectionMethodsChange = this.handleDataCollectionMethodsChange.bind(this);
    this.handleResponseSetSuccess = this.handleResponseSetSuccess.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.unsavedState = false;
    this.associationChanges = {};
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
    this.associationChanges = {};
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
      this.associationChanges = {};
      this.props.router.push(this.nextLocation.pathname);
    }else{
      this.props.questionSubmitter(this.state, this.state.comment, this.unsavedState, this.associationChanges, () => {
        this.unsavedState = false;
        this.associationChanges = {};
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
      showPotentialDuplicates: false,
      showInfoCategory: false,
      showInfoResponseType: false,
      showInfoDataCollectionMethod: false,
      showInfoOtherAllowed: false,
      showInfoTags: false,
      showInfoSearchandSelectResponseSet: false,
      showinfoSelectedResponseSets:false,
      showInfoAddNewResponseSet: false,
      comment: ''
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
      dataCollectionMethods: [],
      tagList: [],
      otherAllowed: false
    };
  }

  copyQuestion() {
    let questionCopy = {content: this.props.question.content,
      description: this.props.question.description,
      otherAllowed: this.props.question.otherAllowed,
      categoryId: this.props.question.category ? this.props.question.category.id : undefined,
      subcategoryId: this.props.question.subcategory ? this.props.question.subcategory.id : undefined,
      responseTypeId: this.props.question.responseType ? this.props.question.responseType.id : undefined};
    questionCopy.conceptsAttributes = filterConcepts(this.props.question.concepts);
    questionCopy.tagList = this.props.question.tagList || [];
    questionCopy.linkedResponseSets = this.props.question.responseSets || [];
    questionCopy.dataCollectionMethods = this.props.question.dataCollectionMethods || [];
    return questionCopy;
  }

  stateForRevise() {
    let reviseState = this.modalInitialState();
    Object.assign(reviseState, this.copyQuestion());
    if (this.props.action === 'revise') {
      reviseState.version = this.props.question.version + 1;
    }
    reviseState.groups = this.props.question.groups || [];
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
      return (
      <div>Loading....</div>);
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
        <Row>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h1 className="panel-title">{`${this.actionWord()} Question`}</h1>
              </div>
              <div className="panel-body">
                <Row>
                    <Col md={8} className="question-form-group">
                      <label className="input-label" htmlFor="content">Question Name</label>
                      <input className="input-format" tabIndex="3" placeholder="Question text" type="text" name="content" id="content" defaultValue={state.content} onChange={this.handleChange('content')} />
                    </Col>
                    <Col md={4} className="question-form-group">
                    <InfoModal show={this.state.showInfoCategory} header="Category" body={<p>The category will define the type of Question you are creating.<br/><br/>This attribute is optional but completion allows other users to find questions of interest. There is an advanced search filter that is based off of this attribute.</p>} hideInfo={()=>this.setState({showInfoCategory: false})} />
                    <label className="input-label" htmlFor="categoryId">Category<Button bsStyle='link' style={{ padding: 3}} onClick={() => this.setState({showInfoCategory: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
                      <select className="input-select" tabIndex="3" name="categoryId" id="categoryId" value={state.categoryId || undefined} onChange={this.handleChange('categoryId')} >
                        <option value=""></option>
                        {categories && values(categories).map((ct) => {
                          return <option key={ct.id} value={ct.id}>{ct.name}</option>;
                        })}
                      </select>
                    </Col>
                </Row>
                {categories && categories[state.categoryId] && categories[state.categoryId].subcategories && categories[state.categoryId].subcategories.length > 0 &&
                  <Row>
                    <Col md={8} className="question-form-group">
                    </Col>
                    <Col md={4} className="question-form-group">
                      <label className="input-label" htmlFor="subcategoryId">Subcategory</label>
                      <select className="input-select" tabIndex="3" name="subcategoryId" id="subcategoryId" value={state.subcategoryId || undefined} onChange={this.handleChange('subcategoryId')} >
                        <option value=""></option>
                        {categories[state.categoryId].subcategories.map((s) => {
                          return <option key={s.id} value={s.id}>{s.name}</option>;
                        })}
                      </select>
                    </Col>
                  </Row>
                }
                <Row>
                  <Col md={8} className="question-form-group">
                    <label className="input-label" htmlFor="question-description">Description</label>
                    <textarea className="input-format" tabIndex="3" placeholder="Question description" type="text" name="question-description" id="question-description" defaultValue={state.description} onChange={this.handleChange('description')} />
                  </Col>

                  <Col md={4} className="question-form-group">
                  <InfoModal show={this.state.showInfoResponseType} header="Response Type" body={<p>Choose a Response Type that indicates what kind of response is expected for the Question. Common response types include choice, text, and date.  These response types are defined by HL7.</p>} hideInfo={()=>this.setState({showInfoResponseType: false})} />
                  <label className="input-label" htmlFor="responseTypeId">Response Type<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoResponseType: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
                    <select name="responseTypeId" tabIndex="3" id="responseTypeId" className="input-select" value={state.responseTypeId || undefined} onChange={this.handleResponseTypeChange()} >
                      {this.sortedResponseTypes(this.props.responseTypes).map((rt) => {
                        return (<option key={rt.id} value={rt.id} >{rt.name} - {rt.description}</option>);
                      })}
                    </select>
                  </Col>
                </Row>
                <Row>
                  <Col md={8} className="question-form-group">
                    <InfoModal show={this.state.showInfoTags} header="Tags" body={<InfoModalBodyContent enum='tags'></InfoModalBodyContent>} hideInfo={()=>this.setState({showInfoTags: false})} />
                    <label className="input-label" htmlFor="question-tags">Tags<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoTags: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
                    <p>Press 'Tab' or 'Enter' after typing a tag to add it to the list. Press 'Backspace' or click the 'x' icon to remove a tag.</p>
                    <TagsInput value={this.state.tagList} onChange={this.handleTagChange} inputProps={{tabIndex: '3', id: 'question-tags'}} />
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="question-form-group">
                    <InfoModal show={this.state.showInfoDataCollectionMethod} header="Data Collection Method" body={<p>The Data Collection Method attribute represents the manner in which the Question is used to collect data at the time of administration. This is not necessarily the same as how CDC is receiving the data.<br/><br/>This attribute is optional but completion helps other users find questions in SDP-V most suited for a specific data collection method. There is an advanced search filter based off of this attribute.</p>} hideInfo={()=>this.setState({showInfoDataCollectionMethod: false})} />
                    <label className="input-label" htmlFor="dataCollectionMethod">Data Collection Method<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoDataCollectionMethod: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
                    <DataCollectionSelect onChangeFunc={this.handleDataCollectionMethodsChange()} methods={state.dataCollectionMethods} />
                  </Col>
                </Row>
                {this.otherAllowedBox()}
                <Row>
                  <Col md={12}>
                    <h2 className="code-system-mappings-table-header"><strong>Code System Mappings</strong></h2>
                    <CodedSetTableEditContainer itemWatcher={(r) => this.handleConceptsChange(r)}
                             initialItems={this.state.conceptsAttributes}
                             parentName={'question'}
                             childName={'Code System Mapping'} />
                  </Col>
                </Row>
                { this.isChoiceType() ?
                <Row className="response-set-row">
                  <Col md={6} className="response-set-label">
                    <InfoModal show={this.state.showInfoSearchandSelectResponseSet} header="Search and Select Response Sets" body={<p>Search through existing Response Sets in the system to identify the expected responses from this question. To select a specific Response Set, click the blue “+” button. Once added, the “+” sign will change into a checkmark to indicate the Response Set will be associated with the Question save.</p>} hideInfo={()=>this.setState({showInfoSearchandSelectResponseSet:false})} />
                    <label htmlFor="selectedResponseSet">Search and Select Response Sets<Button bsStyle='link' style={{ padding: 3, display: 'flex', justifyContent: 'center' }} onClick={() => this.setState({showInfoSearchandSelectResponseSet: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
                  </Col>
                  <Col md={6} className="response-set-label">
                    <InfoModal show={this.state.showinfoSelectedResponseSets} header="Selected Response Sets" body={<p>The “Selected Response Sets” panel displays your selections. Adding a Response Set to a Question simply means that the Response Set(s) are a valid set of choices for the Question. You can add more than one Response Set if appropriate. <br/><br/><u>Author Recommended Response Sets</u>: Response sets added to a Question by the author at the time of creation will be displayed in the UI on the Question Details page as “Author Recommended Response Sets”. This allows the author of the question to identify Response Sets that are appropriate for different contexts (e.g., For a Question asking about a vaccine administered, valid Response Sets may include condition-specific vaccine types, like varicella, influenza, or pertussis).  These “author recommended response sets” will populate the Response Set drop down menu on the “Create Section” page to encourage reuse of these Response Sets. <br/><br/><u>Note</u>: If a user would like reuse a Question, but the “author recommended response sets” do not meet the needs of that user, users can select other Response Sets from the repository to associate with the Question while creating, editing, or revising a Section (See Section 7.1.3 of the User Guide). This allows other SDP-V users to reuse Questions in the repository but provides the flexibility to select a context appropriate Response Set on a given Section.</p>} hideInfo={()=>this.setState({showinfoSelectedResponseSets: false})} />
                    <label htmlFor="selectedResponseSet">Selected Response Set<Button bsStyle='link' style={{ padding: 3, display: 'flex', justifyContent: 'center'}} onClick={() => this.setState({showinfoSelectedResponseSets: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
                    <InfoModal show={this.state.showInfoAddNewResponseSet} header="Add New Response Set" body={<p>After searching the service, if no suitable response sets are found, a user can create  a new response set and add it to question directly from this page.</p>} hideInfo={()=>this.setState({showInfoAddNewResponseSet: false})} />
                    <Button bsStyle='link' style={{ padding: 5 }} onClick={() => this.setState({showInfoAddNewResponseSet: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>
                    <button className="btn btn-primary add-new-response-set" type="button" id="add-new-response-set" onClick={() => this.setState({showResponseSetModal:true})}>Add New Response Set</button>
                  </Col>
                </Row>
                : ''}
                { this.isChoiceType() ?
                  <ResponseSetDragWidget handleResponseSetsChange={this.handleResponseSetsChange}
                                         selectedResponseSets={this.state.linkedResponseSets} />
                : ''}
                <div>
                  { this.state.showPotentialDuplicates && this.props.potentialDuplicates && this.props.potentialDuplicates.hits && this.props.potentialDuplicates.hits.total > 0 &&
                    <SearchResultList searchResults={this.props.potentialDuplicates}
                                      isEditPage={false}
                                      currentUser={this.props.currentUser}
                                      title="Suggested Existing Questions for Reuse"/>
                  }
                </div>
                {this.props.action === 'edit' && <Row>
                  <Col md={8} className="question-form-group">
                    <label className="input-label" htmlFor="save-with-comment">Notes / Comments About Changes Made (Optional)</label>
                    <textarea className="input-format" tabIndex="3" placeholder="Add notes about the changes here..." value={state.comment} name="save-with-comment" id="save-with-comment" onChange={this.handleChange('comment')}/>
                  </Col>
                </Row>}
              </div>
              <div className="panel-footer">
                <div className="actions form-group">
                  <button type="submit" name="commit" id='submit-question-form' className="btn btn-default" data-disable-with="Save">Save</button>
                  {this.cancelButton()}
                </div>
              </div>
            </div>
        </Row>
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

  handleTagChange(tagList) {
    this.setState({tagList});
    this.unsavedState = true;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.props.action === 'edit') {
      this.props.draftSubmitter(this.props.id, this.state, this.state.comment, this.unsavedState, this.associationChanges, (response) => {
        // TODO: Handle when the saving question fails.
        this.unsavedState = false;
        this.associationChanges = {};
        if (response.status === 200) {
          this.props.router.push(`/questions/${response.data.id}`);
        }
      });
    } else {
      this.props.questionSubmitter(this.state, this.state.comment, this.unsavedState, this.associationChanges, (successResponse) => {
        this.unsavedState = false;
        this.associationChanges = {};
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
    if (this.associationChanges['mappings']) {
      this.associationChanges['mappings']['updated'] = newConcepts;
    } else {
      this.associationChanges['mappings'] = {original: this.state.conceptsAttributes, updated: newConcepts};
    }
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
        <Row>
          <Col md={8}/>
          <Col md={4} className="question-form-group">
            <InfoModal show={this.state.showInfoOtherAllowed} header="Other Allowed" body={<p>The “Other Allowed” choice appears when the “Choice” Response Type is selected. When checked, it indicates that the Question provides an “other” choice where a respondent can provide their own answer outside of the chosen Response Set.</p>} hideInfo={()=>this.setState({showInfoOtherAllowed: false})} />
            <input className="form-check-input" tabIndex="3" type="checkbox" name="otherAllowed" id="otherAllowed" checked={this.state.otherAllowed} onChange={() => this.toggleOtherAllowed()} />
            <label htmlFor="otherAllowed">Other Allowed<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoOtherAllowed: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
          </Col>
        </Row>
      );
    } else {
      return '';
    }
  }

  handleDataCollectionMethodsChange(){
    return (event) => {
      this.setState({dataCollectionMethods: $(event.target).val()});
      this.unsavedState = true;
    };
  }

  handleResponseSetsChange(newResponseSets){
    if (this.associationChanges['response sets']) {
      this.associationChanges['response sets']['updated'] = newResponseSets.map((rs) => {
        return {id: rs.id, name: rs.name};
      });
    } else {
      this.associationChanges['response sets'] = {original: this.state.linkedResponseSets.map((rs) => {
        return {id: rs.id, name: rs.name};
      }), updated: newResponseSets.map((rs) => {
        return {id: rs.id, name: rs.name};
      })};
    }
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
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  currentUser: currentUserProps
};

export default QuestionEdit;
