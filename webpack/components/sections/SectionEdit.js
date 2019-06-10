import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button, Row, Col } from 'react-bootstrap';
import compact from 'lodash/compact';
import union from 'lodash/union';
import TagsInput from 'react-tagsinput';

import { sectionProps, sectionsProps } from '../../prop-types/section_props';
import { responseSetsProps } from '../../prop-types/response_set_props';
import { questionsProps } from '../../prop-types/question_props';

import AddedNestedItem from '../../containers/sections/AddedNestedItem';
import CodedSetTableEditContainer from '../../containers/CodedSetTableEditContainer';
import LoadingSpinner from '../../components/LoadingSpinner';

import ModalDialog  from '../ModalDialog';
import Errors from '../Errors';
import InfoModal from '../InfoModal';

class SectionEdit extends Component {

  stateForRevise(section) {
    var state = this.stateForEdit(section);
    state.version = state.version + 1;
    return state;
  }

  stateForExtend(section) {
    var state = this.stateForEdit(section);
    state.id = null;
    state.versionIndependentId = null;
    state.version = 1;
    state.parentId = section.id;
    state.groups = [];
    return state;
  }

  stateForEdit(section) {
    const id = section.id;
    const versionIndependentId = section.versionIndependentId;
    const version = section.version;
    const name = section.name || '';
    const description = section.description || '';
    const sectionNestedItems = section.sectionNestedItems || [];
    const showWarningModal = false;
    const parentId = section.parent ? section.parent.id : '';
    const conceptsAttributes = filterConcepts(section.concepts) || [];
    const tagList = section.tagList || [];
    const linkedResponseSets = this.findLinkedResponseSets(sectionNestedItems);
    const groups = section.groups || [];
    const comment = '';
    return {sectionNestedItems, name, id, comment, version, versionIndependentId, description, showWarningModal, parentId, linkedResponseSets, conceptsAttributes, tagList, groups};
  }

  constructor(props) {
    super(props);
    switch (this.props.action) {
      case 'revise':
        this.state = this.stateForRevise(props.section);
        break;
      case 'extend':
        this.state = this.stateForExtend(props.section);
        break;
      case 'edit':
        this.state = this.stateForEdit(props.section);
        break;
      default:
        this.state = this.stateForRevise({});
    }
    this.unsavedState = false;
    this.associationChanges = {};
    this.lastNestedItemCount = this.state.sectionNestedItems.length;
    this.addedResponseSets = compact(this.state.sectionNestedItems.map((sni) => sni.responseSetId));

    this.handleSubmit   = this.handleSubmit.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.moveNestedItemUp = this.moveNestedItemUp.bind(this);
    this.removeNestedItem = this.removeNestedItem.bind(this);
    this.cancelLeaveModal = this.cancelLeaveModal.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.moveNestedItemDown = this.moveNestedItemDown.bind(this);
    this.handleModalResponse = this.handleModalResponse.bind(this);
    this.handleProgramVarChange   = this.handleProgramVarChange.bind(this);
    this.handleChangeDescription  = this.handleChangeDescription.bind(this);
    this.handleSelectSearchResult = this.handleSelectSearchResult.bind(this);
    this.handleModalResponseAndLeave  = this.handleModalResponseAndLeave.bind(this);
    this.handleResponseSetChangeEvent = this.handleResponseSetChangeEvent.bind(this);
    this.writeAssociationChanges = this.writeAssociationChanges.bind(this);
  }

  componentDidMount() {
    this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    window.onbeforeunload = this.windowWillUnload.bind(this);
  }

  componentWillUnmount() {
    this.unsavedState = false;
    this.associationChanges = {};
    this.unbindHook();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.lastNestedItemCount !== prevState.sectionNestedItems.length) {
      this.unsavedState = true;
      this.lastNestedItemCount = prevState.sectionNestedItems.length;
    }
  }

  routerWillLeave(nextLocation) {
    this.setState({ showWarningModal: this.unsavedState });
    this.nextLocation = nextLocation;
    return !this.unsavedState;
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

  handleModalResponse(){
    this.setState({ showWarningModal: false });
    let section = Object.assign({}, this.state);
    section.linkedItems = this.state.sectionNestedItems;
    this.props.sectionSubmitter(section, this.state.comment, this.unsavedState, this.associationChanges, (response) => {
      // TODO: Handle when the saving section fails.
      this.unsavedState = false;
      this.associationChanges = {};
      if (response.status === 201) {
        this.props.router.push(this.nextLocation.pathname);
      }
    });
  }

  handleModalResponseAndLeave(){
    this.setState({ showWarningModal: false });
    this.unsavedState = false;
    this.associationChanges = {};
    this.props.router.push(this.nextLocation.pathname);
  }

  windowWillUnload() {
    return (this.unsavedState || null);
  }

  handleResponseSetChange(questionIndex, responseSetId) {
    if(isNaN(responseSetId)){
      responseSetId = null;
    }
    let newState = Object.assign({}, this.state);
    newState.sectionNestedItems[questionIndex].responseSetId = responseSetId;
    newState.linkedResponseSets = this.findLinkedResponseSets(newState.sectionNestedItems);
    this.setState(newState);
    this.unsavedState = true;
  }

  handleProgramVarChange(sniIndex, programVar) {
    if (this.associationChanges['pdv'] && this.associationChanges['pdv'][sniIndex]) {
      this.associationChanges['pdv'][sniIndex]['updated'] = programVar;
    } else {
      this.associationChanges['pdv'] = {};
      let original = this.state.sectionNestedItems[sniIndex].programVar;
      this.associationChanges['pdv'][sniIndex] = {original: original, updated: programVar};
    }
    let newState = Object.assign({}, this.state);
    newState.sectionNestedItems[sniIndex].programVar = programVar;
    this.setState(newState);
    this.unsavedState = true;
  }

  handleChange(field, event) {
    let newState = {};
    newState[field] = event.target.value;
    this.setState(newState);
    this.unsavedState = true;
  }

  handleTagChange(tagList) {
    this.setState({tagList});
    this.unsavedState = true;
  }

  handleChangeName(event){
    this.handleChange('name', event);
  }

  handleChangeComment(event){
    this.handleChange('comment', event);
  }

  handleChangeDescription(event){
    this.handleChange('description', event);
  }

  handleSubmit(event) {
    event.preventDefault();
    // Because of the way we have to pass the current questions in we have to manually sync props and state for submit
    let section = Object.assign({}, this.state);
    section.linkedItems = this.state.sectionNestedItems;
    this.props.sectionSubmitter(section, this.state.comment, this.unsavedState, this.associationChanges, (response) => {
      this.unsavedState = false;
      this.associationChanges = {};
      if (this.props.action === 'new') {
        let stats = Object.assign({}, this.props.stats);
        stats.sectionCount = this.props.stats.sectionCount + 1;
        stats.mySectionCount = this.props.stats.mySectionCount + 1;
        this.props.setStats(stats);
      }
      this.props.router.push(`/sections/${response.data.id}`);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  cancelButton() {
    if(this.props.section && this.props.section.id) {
      return(<Link tabIndex="3" className="btn btn-default pull-right" to={`/sections/${this.props.section.id}`}>Cancel</Link>);
    }
    return(<Link tabIndex="3" className="btn btn-default pull-right" to='/'>Cancel</Link>);
  }

  cancelLeaveModal(){
    this.props.router.push(this.props.route.path);
    this.setState({ showWarningModal: false });
  }

  addLinkedResponseSet(questionIndex, responseSet){
    if(this.state.sectionNestedItems[questionIndex].responseSetId == responseSet.id){
      return;
    }
    this.addedResponseSets = union(this.addedResponseSets, [responseSet.id]);
    var newState = Object.assign({}, this.state);
    newState.sectionNestedItems[questionIndex].responseSetId = responseSet.id;
    this.setState(newState);
  }

  writeAssociationChanges(snis) {
    let sniId, sniName, sniType;
    return snis.map((sni) => {
      if (sni.nestedSectionId) {
        sniId = sni.nestedSectionId;
        sniName = this.props.sections[sni.nestedSectionId].name;
        sniType = 'section';
      } else {
        sniId = sni.questionId;
        sniName = this.props.questions[sni.questionId].name || this.props.questions[sni.questionId].content;
        sniType = 'question';
      }
      return {id: sniId, name: sniName, type: sniType};
    });
  }

  updateSectionNestedItems(sectionNestedItems){
    var newState = Object.assign(this.state, {sectionNestedItems: sectionNestedItems, linkedResponseSets: this.findLinkedResponseSets(sectionNestedItems)});
    if (this.associationChanges['nested items']) {
      this.associationChanges['nested items']['updated'] = this.writeAssociationChanges(sectionNestedItems);
    } else {
      this.associationChanges['nested items'] = {original: this.writeAssociationChanges(this.state.sectionNestedItems), updated: this.writeAssociationChanges(sectionNestedItems)};
    }
    this.setState(newState);
  }

  findLinkedResponseSets(sectionNestedItems){
    var linkedResponseSetMap = {};
    sectionNestedItems.map((sni) => {
      var linkedResponseSets = [];
      var qId = sni.questionId || -1;
      if(this.props.questions[qId] && this.props.questions[qId].responseSets && this.props.questions[qId].responseSets.length > 0) {
        linkedResponseSets = this.props.questions[qId].responseSets || [];
      }
      var otherResponseSets = union(this.addedResponseSets, [sni.responseSetId]);
      linkedResponseSets = union(linkedResponseSets, otherResponseSets);
      linkedResponseSetMap[sni.questionId] = compact(linkedResponseSets.map((rsId) => this.props.responseSets[rsId]));
    });
    return linkedResponseSetMap;
  }

  handleSelectSearchResult(i, responseSet){
    this.addLinkedResponseSet(i, responseSet);
    this.handleResponseSetChange(i, responseSet.id);
  }

  handleResponseSetChangeEvent(i, event){
    this.handleResponseSetChange(i, parseInt(event.target.value));
  }

  moveNestedItemUp(event){
    event.preventDefault();
    this.props.reorderNestedItem(this.state, event.target.dataset.index, 1);
  }

  moveNestedItemDown(event){
    event.preventDefault();
    this.props.reorderNestedItem(this.state, event.target.dataset.index, -1);
  }

  removeNestedItem(event){
    event.preventDefault();
    this.props.removeNestedItem(this.state, event.target.dataset.index);
  }

  onEnter(e, prev) {
    if(e.key === 'Enter' && parseInt(e.target.value)) {
      e.preventDefault();
      this.props.reorderNestedItem(this.state, prev-1, prev-parseInt(e.target.value));
      e.target.value = '';
    }
  }

  addedNestedItems() {
    return (
      <div id="added-nested-items" aria-label="Added sections and questions">
      <Row>
        <div className="response-set-header">
          <Col md={5} className="response-set-label">
          <InfoModal show={this.state.showInfoSelectedQuestionsandSections} header="Selected Questions and Sections" body={<p>The “Selected Questions and Sections” panel displays the selected content for this Section. A Section may contain either Questions only, Sections only, or a mixture or both Questions and Sections.</p>} hideInfo={()=>this.setState({showInfoSelectedQuestionsandSections: false})} />
          <label htmlFor="selectedQuestionsandSections">Selected Questions &amp; Sections<Button bsStyle='link' style={{ padding: 3, display: 'flex', justifyContent: 'center'}} onClick={() => this.setState({showInfoSelectedQuestionsandSections: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
          </Col>
          <Col md={7} className="response-set-label">
            <InfoModal show={this.state.showInfoAddNewResponseSet} header="Add New Response Set" body={<p><u>For Questions with Choice or Open Choice response types</u>:  The Vocabulary Service allows users to reuse Questions in the repository created by another author while providing the flexibility to select a context appropriate Response Set on a given Section if the author recommended response sets do not fit their needs.
              <br/><br/>To determine if a new response set if necessary:
              <br/><br/>1) The user should first consider using the response sets populated in the response set drop-down menu; these are response sets there were selected as valid response options by the question author (aka author recommended response sets).
              <br/><br/>2) If none of the author recommend response sets is suitable, the user should select the magnifying glass icon to search for existing response sets that can be used with the selected question. To add a selected Response Set to the question, click the blue “+” button.
              <br/><br/>3) After searching the service, if no suitable response sets are found, a user can create  a new response set directly from this page. The user can then add the newly created response set to the selected question by selecting the magnifying glass icon and locating the response set. To add the Response Set to the question, click the blue “+” button.</p>} hideInfo={()=>this.setState({showInfoAddNewResponseSet: false})} />
            <Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoAddNewResponseSet: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>
            <Button onClick={this.props.showResponseSetModal} bsStyle="primary">Add New Response Set</Button>
          </Col>
        </div>
      </Row>
        <div className="added-nested-item-group">
          {this.state.sectionNestedItems.map((sni, i) =>
            <Row key={sni.questionId || sni.nestedSectionId}>
              <Col md={11}>
                <AddedNestedItem index={i}
                                 item={sni.questionId ? this.props.questions[sni.questionId] : this.props.sections[sni.nestedSectionId]}
                                 itemType={sni.questionId ? 'question' : 'section'}
                                 programVar={sni.programVar}
                                 responseSets={this.state.linkedResponseSets[sni.questionId] || []}
                                 selectedResponseSet={sni.responseSetId}
                                 handleProgramVarChange={this.handleProgramVarChange}
                                 handleResponseSetChange ={this.handleResponseSetChangeEvent}
                                 handleSelectSearchResult={this.handleSelectSearchResult} />
              </Col>
              <Col md={1}>
                <div className="row section-nested-item-controls">
                  <button data-index={i} className="btn btn-small btn-default move-up" onClick={this.moveNestedItemUp}>
                    <i data-index={i} title="Move Up" className="fa fa fa-arrow-up"></i><span className="sr-only">{`Move Up item on section`}</span>
                  </button>
                </div>
                <div className="row section-nested-item-controls">
                  <input className='col-md-8' style={{'padding-left': '5px', 'padding-right': '1px'}} placeholder={i+1} onKeyPress={event => this.onEnter(event, i+1)} />
                </div>
                <div className="row section-nested-item-controls">
                  <button data-index={i} className="btn btn-small btn-default move-down" onClick={this.moveNestedItemDown}>
                    <i data-index={i} className="fa fa fa-arrow-down" title="Move Down"></i><span className="sr-only">{`Move down item on section`}</span>
                  </button>
                </div>
                <div className="row section-nested-item-controls">
                  <button data-index={i} className="btn btn-small btn-default delete-question" onClick={this.removeNestedItem}>
                    <i data-index={i} className="fa fa fa-trash" title="Remove"></i><span className="sr-only">{`Remove item from section`}</span>
                  </button>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </div>
    );
  }

  render() {
    if(!this.props.questions || !this.props.responseSets || !this.props.sections){
      return (
        <div><LoadingSpinner msg="Loading..." /></div>
      );
    }
    return (
      <Col md={7} className="section-edit-details">
        <div className="" id='section-div'>
        <ModalDialog show ={this.state.showWarningModal}
                     title="Warning"
                     subTitle="Unsaved Changes"
                     warning={true}
                     message="You are about to leave a page with unsaved changes. How would you like to proceed?"
                     secondaryButtonMessage="Continue Without Saving"
                     primaryButtonMessage="Save & Leave"
                     cancelButtonMessage="Cancel"
                     primaryButtonAction={this.handleModalResponse}
                     cancelButtonAction ={this.cancelLeaveModal}
                     secondaryButtonAction={this.handleModalResponseAndLeave} />
        <form onSubmit={this.handleSubmit}>
          <Errors errors={this.state.errors} />
            <div className="form-inline">
              <input tabIndex="3" className='btn btn-default pull-right' name="Save Section" type="submit" value={`Save`}/>
              <button tabIndex="3" className="btn btn-default pull-right" disabled>Export</button>
              {this.cancelButton()}
            </div>
            <br/>
            <hr />
            <div className="section-group">
              <label htmlFor="section-name">Section Name</label>
              <input tabIndex="3" className="input-format" placeholder="Section Name" type="text" value={this.state.name} name="section-name" id="section-name" onChange={this.handleChangeName}/>
            </div>
            <div className="section-group">
              <label htmlFor="section-description">Description</label>
              <input tabIndex="3" className="input-format" placeholder="Enter a description here..." type="text" value={this.state.description || ''} name="section-description" id="section-description" onChange={this.handleChangeDescription}/>
            </div>
            <div className="section-group">
              <InfoModal show={this.state.showInfoTags} header="Tags" body={<p>Tags are text strings that are either keywords or short phrases created by users to facilitate content discovery, organization, and reuse. Tags are weighted in the dashboard search result algorithm so users are presented with search results that have been tagged with the same keyword(s) entered in the dashboard search bar.
                <br/><br/>Keyword tags can be changed (added or deleted) at any time by the author(s) to meet user needs and to optimize search results. The history of tags is not saved on the change history tab; tags are not versioned.</p>} hideInfo={()=>this.setState({showInfoTags: false})} />
              <label htmlFor="section-tags">Tags<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoTags: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
              <p>Press 'Tab' or 'Enter' after typing a tag to add it to the list. Press 'Backspace' or click the 'x' icon to remove a tag.</p>
              <TagsInput value={this.state.tagList} onChange={this.handleTagChange} inputProps={{tabIndex: '3', id: 'section-tags'}} />
            </div>
            <div className="section-group">
              <h2 className="code-system-mappings-table-header"><strong>Code System Mappings</strong></h2>
              <CodedSetTableEditContainer itemWatcher={(r) => this.handleConceptsChange(r)}
                       initialItems={this.state.conceptsAttributes}
                       parentName={'section'}
                       childName={'Code System Mapping'} />
            </div>
            {this.props.action === 'edit' && <div className="section-group">
              <label  htmlFor="save-with-comment">Notes / Comments About Changes Made (Optional)</label>
              <textarea className="input-format" tabIndex="3" placeholder="Add notes about the changes here..." type="text" value={this.state.comment || ''} name="save-with-comment" id="save-with-comment" onChange={this.handleChangeComment}/>
            </div>}
          {this.addedNestedItems()}
        </form>
        </div>
      </Col>
    );
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

SectionEdit.propTypes = {
  section: sectionProps,
  action: PropTypes.string.isRequired,
  setStats: PropTypes.func,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  stats: PropTypes.object,
  sectionSubmitter:   PropTypes.func.isRequired,
  reorderNestedItem: PropTypes.func.isRequired,
  removeNestedItem:  PropTypes.func.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  responseSets: responseSetsProps,
  questions: questionsProps.isRequired,
  sections: sectionsProps,
  showResponseSetModal: PropTypes.func.isRequired
};

export default SectionEdit;
