import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import compact from 'lodash/compact';
import union from 'lodash/union';

import { sectionProps, sectionsProps } from '../../prop-types/section_props';
import { responseSetsProps } from '../../prop-types/response_set_props';
import { questionsProps } from '../../prop-types/question_props';

import AddedNestedItem from '../../containers/sections/AddedNestedItem';
import CodedSetTableEditContainer from '../../containers/CodedSetTableEditContainer';
import ModalDialog  from '../ModalDialog';
import Errors from '../Errors';

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
    const linkedResponseSets = this.findLinkedResponseSets(sectionNestedItems);
    const groups = section.groups || [];
    return {sectionNestedItems, name, id, version, versionIndependentId, description, showWarningModal, parentId, linkedResponseSets, conceptsAttributes, groups};
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
    this.lastNestedItemCount = this.state.sectionNestedItems.length;
    this.addedResponseSets = compact(this.state.sectionNestedItems.map((sni) => sni.responseSetId));

    this.handleSubmit   = this.handleSubmit.bind(this);
    this.moveNestedItemUp = this.moveNestedItemUp.bind(this);
    this.removeNestedItem = this.removeNestedItem.bind(this);
    this.cancelLeaveModal = this.cancelLeaveModal.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.moveNestedItemDown = this.moveNestedItemDown.bind(this);
    this.handleModalResponse = this.handleModalResponse.bind(this);
    this.handleProgramVarChange   = this.handleProgramVarChange.bind(this);
    this.handleChangeDescription  = this.handleChangeDescription.bind(this);
    this.handleSelectSearchResult = this.handleSelectSearchResult.bind(this);
    this.handleModalResponseAndLeave  = this.handleModalResponseAndLeave.bind(this);
    this.handleResponseSetChangeEvent = this.handleResponseSetChangeEvent.bind(this);
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
    this.setState({conceptsAttributes: filterConcepts(newConcepts)});
    this.unsavedState = true;
  }

  handleModalResponse(){
    this.setState({ showWarningModal: false });
    let section = Object.assign({}, this.state);
    section.linkedItems = this.state.sectionNestedItems;
    this.props.sectionSubmitter(section, (response) => {
      // TODO: Handle when the saving section fails.
      this.unsavedState = false;
      if (response.status === 201) {
        this.props.router.push(this.nextLocation.pathname);
      }
    });
  }

  handleModalResponseAndLeave(){
    this.setState({ showWarningModal: false });
    this.unsavedState = false;
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

  handleChangeName(event){
    this.handleChange('name', event);
  }

  handleChangeDescription(event){
    this.handleChange('description', event);
  }

  handleSubmit(event) {
    event.preventDefault();
    // Because of the way we have to pass the current questions in we have to manually sync props and state for submit
    let section = Object.assign({}, this.state);
    section.linkedItems = this.state.sectionNestedItems;
    this.props.sectionSubmitter(section, (response) => {
      this.unsavedState = false;
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

  updateSectionNestedItems(sectionNestedItems){
    var newState = Object.assign(this.state, {sectionNestedItems: sectionNestedItems, linkedResponseSets: this.findLinkedResponseSets(sectionNestedItems)});
    this.setState(newState);
  }

  findLinkedResponseSets(sectionNestedItems, addedResponseSets){
    var linkedResponseSetMap = {};
    var otherResponseSets = union(this.addedResponseSets || addedResponseSets, sectionNestedItems.map((sni) => sni.responseSetId));
    sectionNestedItems.map((sni) => {
      var linkedResponseSets = [];
      var qId = sni.questionId || -1;
      if(this.props.questions[qId] && this.props.questions[qId].responseSets && this.props.questions[qId].responseSets.length > 0) {
        linkedResponseSets = this.props.questions[qId].responseSets || [];
      }
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

  addedNestedItems() {
    return (
      <div id="added-nested-items" aria-label="Added sections and questions">
        <div className="row">
          <div className="response-set-header">
            <div className="col-md-5 response-set-label"><span><b>Questions &amp; Sections</b></span></div>
            <div className="col-md-7 response-set-label">
              <Button onClick={this.props.showResponseSetModal} bsStyle="primary">Add New Response Set</Button>
            </div>
          </div>
        </div>
        <div className="added-nested-item-group">
          {this.state.sectionNestedItems.map((sni, i) =>
            <div className="row" key={sni.questionId || sni.nestedSectionId}>
              <div className="col-md-11">
                <AddedNestedItem index={i}
                                 item={sni.questionId ? this.props.questions[sni.questionId] : this.props.sections[sni.nestedSectionId]}
                                 itemType={sni.questionId ? 'question' : 'section'}
                                 programVar={sni.programVar}
                                 responseSets={this.state.linkedResponseSets[sni.questionId] || []}
                                 selectedResponseSet={sni.responseSetId}
                                 handleProgramVarChange={this.handleProgramVarChange}
                                 handleResponseSetChange ={this.handleResponseSetChangeEvent}
                                 handleSelectSearchResult={this.handleSelectSearchResult} />
              </div>
              <div className="col-md-1">
                <div className="row section-nested-item-controls">
                  <button data-index={i} className="btn btn-small btn-default move-up" onClick={this.moveNestedItemUp}>
                    <i data-index={i} title="Move Up" className="fa fa fa-arrow-up"></i><span className="sr-only">{`Move Up item on section`}</span>
                  </button>
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
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    if(!this.props.questions || !this.props.responseSets || !this.props.sections){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="col-md-7 section-edit-details">
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
            <button tabIndex="3" className="btn btn-default btn-sm" disabled><span className="fa fa-navicon"></span><span className="sr-only">Edit Action Menu</span></button>
            <input tabIndex="3" className='btn btn-default pull-right' name="Save Section" type="submit" value={`Save`}/>
            <button tabIndex="3" className="btn btn-default pull-right" disabled>Export</button>
            {this.cancelButton()}
          </div>
          <hr />
          <div className="section-group">
            <label htmlFor="section-name" hidden>Name</label>
            <input tabIndex="3" className="input-format" placeholder="Section Name" type="text" value={this.state.name} name="section-name" id="section-name" onChange={this.handleChangeName}/>
          </div>
          <div className="section-group">
            <label htmlFor="section-description">Description</label>
            <input tabIndex="3" className="input-format" placeholder="Enter a description here..." type="text" value={this.state.description || ''} name="section-description" id="section-description" onChange={this.handleChangeDescription}/>
          </div>
          <div className="section-group">
            <h2 className="tags-table-header"><strong>Tags</strong></h2>
            <CodedSetTableEditContainer itemWatcher={(r) => this.handleConceptsChange(r)}
                     initialItems={this.state.conceptsAttributes}
                     parentName={'section'}
                     childName={'tag'} />
          </div>
        {this.addedNestedItems()}
      </form>
      </div>
      </div>
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
