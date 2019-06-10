import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';
import TagsInput from 'react-tagsinput';

import { surveyProps } from '../../prop-types/survey_props';
import { sectionsProps } from '../../prop-types/section_props';
import { surveillanceSystemsProps } from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';
import { questionsProps } from "../../prop-types/question_props";
import currentUserProps from "../../prop-types/current_user_props";

import SurveySectionList from './SurveySectionList';
import CodedSetTableEditContainer from '../../containers/CodedSetTableEditContainer';
import Errors from '../Errors';
import ModalDialog from '../ModalDialog';
import InfoModal from '../InfoModal';
import ProgSysEditModal from './ProgSysEditModal';

class SurveyEdit extends Component {

  stateForNew(currentUser) {
    return {
      id: null,
      comment: '',
      name: '',
      version: 1,
      conceptsAttributes: [],
      tagList: [],
      description: '',
      surveySections: [],
      controlNumber: null,
      ombApprovalDate : '',
      versionIndependentId: null,
      showModal: false,
      showInfo: false,
      showInfoOMBApproval: false,
      showInfoTags: false,
      showInfoProgram: false,
      showInfoSystem: false,
      showInfoSelectedSections: false,
      showInfoSearchandSelectSections: false,
      progSysModalOpen: false,
      surveillanceProgramId: currentUser.lastProgramId || null,
      surveillanceSystemId: currentUser.lastSystemId || null
    };
  }

  stateForExtend(survey, currentUser) {
    var state = this.stateForEdit(survey, currentUser);
    state.id = null;
    state.versionIndependentId = null;
    state.version = 1;
    state.parentId = survey.id;
    state.controlNumber = '';
    state.ombApprovalDate = '';
    state.groups = [];
    return state;
  }

  stateForEdit(survey, currentUser) {
    var newState = this.stateForNew(currentUser);
    newState.id = survey.id;
    newState.name = survey.name || '';
    newState.version = survey.version;
    newState.description = survey.description || '';
    newState.surveySections = survey.surveySections || [];
    newState.controlNumber = survey.controlNumber;
    newState.ombApprovalDate = survey.ombApprovalDate;
    newState.parentId = survey.parent ? survey.parent.id : '';
    newState.surveillanceProgramId = survey.surveillanceProgramId || newState.surveillanceProgramId;
    newState.surveillanceSystemId = survey.surveillanceSystemId || newState.surveillanceSystemId;
    newState.versionIndependentId = survey.versionIndependentId;
    newState.conceptsAttributes = filterConcepts(survey.concepts);
    newState.tagList = survey.tagList || [];
    newState.groups = survey.groups || [];
    return newState;
  }

  stateForRevise(survey, currentUser) {
    var newState = this.stateForEdit(survey, currentUser);
    newState.version += 1;
    return newState;
  }

  constructor(props) {
    super(props);
    switch (this.props.action) {
      case 'revise':
        this.state = this.stateForRevise(props.survey, props.currentUser);
        break;
      case 'extend':
        this.state = this.stateForExtend(props.survey, props.currentUser);
        break;
      case 'edit':
        this.state = this.stateForEdit(props.survey, props.currentUser);
        break;
      default:
        this.state = this.stateForNew(props.currentUser);
    }
    this.unsavedState = false;
    this.associationChanges = {};
    this.lastSectionCount = this.state.surveySections.length;
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  componentDidMount() {
    this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    window.onbeforeunload = this.windowWillUnload.bind(this);
    if(this.props.sections && !this.associationChanges['sections']) {
      this.associationChanges['sections'] = {original: this.state.surveySections.map((ss) => {
        let ssName = this.props.sections[ss.sectionId].name || '';
        return {id: ss.id, name: ssName};
      }), updated: this.state.surveySections.map((ss) => {
        let ssName = this.props.sections[ss.sectionId].name || '';
        return {id: ss.sectionId, name: ssName};
      })};
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.lastSectionCount !== prevState.surveySections.length) {
      this.unsavedState = true;
      if (this.associationChanges['sections']) {
        this.associationChanges['sections']['updated'] = this.state.surveySections.map((ss) => {
          let ssName = this.props.sections[ss.sectionId].name || '';
          return {id: ss.sectionId, name: ssName};
        });
      } else {
        this.associationChanges['sections'] = {original: prevState.surveySections.map((ss) => {
          let ssName = prevProps.sections[ss.sectionId].name || '';
          return {id: ss.id, name: ssName};
        }), updated: this.state.surveySections.map((ss) => {
          let ssName = this.props.sections[ss.sectionId].name || '';
          return {id: ss.sectionId, name: ssName};
        })};
      }
      this.lastSectionCount = prevState.surveySections.length;
    }
  }

  componentWillUnmount() {
    this.unsavedState = false;
    this.associationChanges = {};
    this.unbindHook();
  }

  routerWillLeave(nextLocation) {
    this.setState({ showModal: this.unsavedState });
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

  handleTagChange(tagList) {
    this.setState({tagList});
    this.unsavedState = true;
  }

  handleModalResponse(leavePage){
    this.setState({ showModal: false });
    if(leavePage){
      this.unsavedState = false;
      this.associationChanges = {};
      this.props.router.push(this.nextLocation.pathname);
    }else{
      let survey = Object.assign({}, this.state);
      // Because we were saving SurveySections with null positions for a while, we need to explicitly set position here to avoid sending a null position back to the server
      // At some point, we can remove this code
      survey.linkedSections = this.state.surveySections.map((sect, i) => ({id: sect.id, surveyId: sect.surveyId, sectionId: sect.sectionId, position: i}));
      this.props.surveySubmitter(survey, this.state.comment, this.unsavedState, this.associationChanges, (response) => {
        // TODO: Handle when the saving survey fails.
        this.unsavedState = false;
        this.associationChanges = {};
        if (response.status === 201) {
          this.props.router.push(this.nextLocation.pathname);
        }
      });
    }
  }

  windowWillUnload() {
    return (this.unsavedState || null);
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
    // Because of the way we have to pass the current sections in we have to manually sync props and state for submit
    let survey = Object.assign({}, this.state);
    survey.linkedSections = this.state.surveySections;
    this.props.surveySubmitter(survey, this.state.comment, this.unsavedState, this.associationChanges, (response) => {
      this.unsavedState = false;
      this.associationChanges = {};
      if (this.props.action === 'new') {
        let stats = Object.assign({}, this.props.stats);
        stats.surveyCount = this.props.stats.surveyCount + 1;
        stats.mySurveyCount = this.props.stats.mySurveyCount + 1;
        this.props.setStats(stats);
      }
      this.props.router.push(`/surveys/${response.data.id}`);
    }, (failureResponse) => {
      this.setState({errors: failureResponse.response.data});
    });
  }

  cancelButton() {
    if(this.props.survey && this.props.survey.id) {
      return(<Link tabIndex="3" className="btn btn-default pull-right" to={`/surveys/${this.props.survey.id}`}>Cancel</Link>);
    }
    return(<Link tabIndex="3" className="btn btn-default pull-right" to='/'>Cancel</Link>);
  }

  render() {
    if(!this.props.sections){
      return ('Loading');
    }
    return (
      <Col md={7} className="survey-edit-details">
        <div id='survey-div'>
        <ModalDialog  show ={this.state.showModal}
                      title="Warning"
                      subTitle="Unsaved Changes"
                      warning ={true}
                      message ="You are about to leave a page with unsaved changes. How would you like to proceed?"
                      secondaryButtonMessage="Continue Without Saving"
                      primaryButtonMessage="Save & Leave"
                      cancelButtonMessage="Cancel"
                      primaryButtonAction={() => this.handleModalResponse(false)}
                      cancelButtonAction ={() => {
                        this.props.router.push(this.props.route.path);
                        this.setState({ showModal: false });
                      }}
                      secondaryButtonAction={() => this.handleModalResponse(true)} />
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <Errors errors={this.state.errors} />
            <div className="survey-inline">
              <input tabIndex="3" className='btn btn-default pull-right' name="Save Survey" type="submit" value={`Save`}/>
              {this.cancelButton()}
            </div>
            <br/>
          <hr />
          <div className="survey-group">
            <label htmlFor="survey-name">Survey Name</label>
            <input tabIndex="3" className="input-format" placeholder="Survey Name" type="text" value={this.state.name} name="survey-name" id="survey-name" onChange={this.handleChange('name')}/>
          </div>
          <Row>
            <Col md={8} className="survey-group">
              <label htmlFor="survey-description">Description</label>
              <input tabIndex="3" className="input-format" placeholder="Enter a description here..." type="text" value={this.state.description || ''} name="survey-description" id="survey-description" onChange={this.handleChange('description')}/>
            </Col>
            <Col md={4} className="survey-group">
              <InfoModal show={this.state.showInfoOMBApproval} header="OMB Approval" body={<p>Provide the OMB Control Number associated with this data collection instrument (if applicable). <br/><br/>This attribute is optional but completion allows other users to find vocabulary that has been used on an OMB-approved data collection instrument. Reuse of vocabulary that has been part of one or more OMB approved Paperwork Reduction Act (PRA) packages in the past can help expedite the review process. There is an advanced search filter that is based off of this attribute.
              </p>} hideInfo={()=>this.setState({showInfoOMBApproval: false})} />
              <label htmlFor="controlNumber">OMB Approval<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoOMBApproval: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
              <input tabIndex="3" className="input-format" placeholder="XXXX-XXXX" type="text" value={this.state.controlNumber || ''} name="controlNumber" id="controlNumber" onChange={this.handleChange('controlNumber')}/>
              { this.state.controlNumber !== '' && this.state.controlNumber !== null &&
                <div>
                <br/>
                  <label htmlFor="ombApprovalDate">OMB Approval Date</label>
                  <input tabIndex="3" className="input-format" type="date" placeholder="mm/dd/yyyy" value={this.state.ombApprovalDate || ''} name ="ombApprovalDate" id="ombApprovalDate" onChange={this.handleChange('ombApprovalDate')}/>
                </div>
              }
            </Col>
          </Row>
          <Row>
            <Col md={12} className="survey-group">
              <InfoModal show={this.state.showInfoTags} header="Tags" body={<p>Tags are text strings that are either keywords or short phrases created by users to facilitate content discovery, organization, and reuse. Tags are weighted in the dashboard search result algorithm so users are presented with search results that have been tagged with the same keyword(s) entered in the dashboard search bar. <br/><br/>Keyword tags can be changed (added or deleted) at any time by the author(s) to meet user needs and to optimize search results. The history of tags is not saved on the change history tab; tags are not versioned.</p>} hideInfo={()=>this.setState({showInfoTags: false})} />
              <label className="input-label" htmlFor="survey-tags">Tags<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoTags: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
              <p>Press 'Tab' or 'Enter' after typing a tag to add it to the list. Press 'Backspace' or click the 'x' icon to remove a tag.</p>
              <TagsInput value={this.state.tagList} onChange={this.handleTagChange} inputProps={{tabIndex: '3', id: 'survey-tags'}} />
            </Col>
          </Row>
          <Row>
            <ProgSysEditModal closer={() => this.setState({progSysModalOpen: false})}
              show={this.state.progSysModalOpen}
              update={(sid, pid) => this.setState({surveillanceSystemId: sid, surveillanceProgramId: pid, progSysModalOpen: false})}
              programId={this.state.surveillanceProgramId}
              systemId={this.state.surveillanceSystemId}
              currentUser={this.props.currentUser}
              surveillanceSystems={this.props.surveillanceSystems}
              surveillancePrograms={this.props.surveillancePrograms} />
            <Col md={6} className="survey-group">
              <InfoModal show={this.state.showInfoProgram} header="Program" body={<p>Identify the program that will maintain and use this vocabulary to support public health activities.<br/><br/>The default value is populated from the author’s profile, The value can be changed by selecting the pencil icon.</p>} hideInfo={()=>this.setState({showInfoProgram: false})} />
              <label htmlFor="program"><strong>Program</strong><Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoProgram: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>:</label>
              <a className="tag-modal-link" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({ progSysModalOpen: true });
              }}> {this.props.surveillancePrograms && this.props.surveillancePrograms[this.state.surveillanceProgramId] && this.props.surveillancePrograms[this.state.surveillanceProgramId].name} <i className="fa fa-pencil-square-o" aria-hidden="true"><text className='sr-only'>Click to edit program</text></i></a>
            </Col>
            <Col md={6} className="survey-group">
              <InfoModal show={this.state.showInfoSystem} header="System" body={<p>Identify the surveillance system that will use this vocabulary to support public health activities.<br/><br/>The default value is populated from the author’s profile, The value can be changed by selecting the pencil icon.</p>} hideInfo={()=>this.setState({showInfoSystem: false})} />
              <label htmlFor="system"><strong>System</strong><Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoSystem: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button>: </label>
              <a className="tag-modal-link" href="#" onClick={(e) => {
                e.preventDefault();
                this.setState({ progSysModalOpen: true });
              }}> {this.props.surveillanceSystems && this.props.surveillanceSystems[this.state.surveillanceSystemId] && this.props.surveillanceSystems[this.state.surveillanceSystemId].name} <i className="fa fa-pencil-square-o" aria-hidden="true"><text className='sr-only'>Click to edit system</text></i></a>
            </Col>
          </Row>
          <h2 className="code-system-mappings-table-header"><strong>Code System Mappings</strong></h2>
          <CodedSetTableEditContainer itemWatcher={(r) => this.handleConceptsChange(r)}
                   initialItems={this.state.conceptsAttributes}
                   parentName={'survey'}
                   childName={'Code System Mapping'} />
          {this.props.action === 'edit' && <div className="survey-group">
            <label  htmlFor="save-with-comment">Notes / Comments About Changes Made (Optional)</label>
            <textarea className="input-format" tabIndex="3" placeholder="Add notes about the changes here..." type="text" value={this.state.comment || ''} name="save-with-comment" id="save-with-comment" onChange={this.handleChange('comment')}/>
          </div>}
          <InfoModal show={this.state.showInfoSelectedSections} header="Selected Sections" body={<p>The “Selected Sections” panel displays the selected sections for this Survey.</p>} hideInfo={()=>this.setState({showInfoSelectedSections: false})} />
          <label className="pull-left">Selected Sections<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfoSelectedSections: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
          <InfoModal show={this.state.showInfo} header="Section Position" body="This column displays the order of the sections. To change position, enter the desired position and hit the 'Enter' key on your keyboard." hideInfo={()=>this.setState({showInfo: false})} />
          <label className="pull-right">Position<Button bsStyle='link' style={{ padding: 3 }} onClick={() => this.setState({showInfo: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
          <br/>
          <SurveySectionList survey={this.state}
                          sections ={this.props.sections}
                          questions  ={this.props.questions}
                          reorderSection={this.props.reorderSection}
                          removeSection ={this.props.removeSection} />
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

SurveyEdit.propTypes = {
  survey: surveyProps,
  currentUser: currentUserProps,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps,
  sections:  sectionsProps.isRequired,
  questions:  questionsProps.isRequired,
  action: PropTypes.string.isRequired,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  surveySubmitter: PropTypes.func.isRequired,
  removeSection:  PropTypes.func.isRequired,
  reorderSection: PropTypes.func.isRequired,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default SurveyEdit;
