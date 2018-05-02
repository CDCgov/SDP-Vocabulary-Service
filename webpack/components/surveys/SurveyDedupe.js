import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

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
import ProgSysEditModal from './ProgSysEditModal';
import iconMap from '../../styles/iconMap';

class SurveyDedupe extends Component {

  stateForNew(currentUser) {
    return {
      id: null,
      name: '',
      version: 1,
      conceptsAttributes: [],
      description: '',
      surveySections: [],
      controlNumber: null,
      versionIndependentId: null,
      showModal: false,
      progSysModalOpen: false,
      surveillanceProgramId: currentUser.lastProgramId || null,
      surveillanceSystemId: currentUser.lastSystemId || null
    };
  }

  stateForEdit(survey, currentUser) {
    var newState = this.stateForNew(currentUser);
    newState.id = survey.id;
    newState.name = survey.name || '';
    newState.version = survey.version;
    newState.description = survey.description || '';
    newState.surveySections = survey.surveySections || [];
    newState.controlNumber = survey.controlNumber;
    newState.parentId = survey.parent ? survey.parent.id : '';
    newState.surveillanceProgramId = survey.surveillanceProgramId || newState.surveillanceProgramId;
    newState.surveillanceSystemId = survey.surveillanceSystemId || newState.surveillanceSystemId;
    newState.versionIndependentId = survey.versionIndependentId;
    newState.conceptsAttributes = filterConcepts(survey.concepts);
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
      case 'dedupe':
        this.state = this.stateForEdit(props.survey, props.currentUser);
        break;
      default:
        this.state = this.stateForNew(props.currentUser);
    }
    this.unsavedState = false;
    this.lastSectionCount = this.state.surveySections.length;
  }

  componentDidMount() {
    this.unbindHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    window.onbeforeunload = this.windowWillUnload.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.lastSectionCount !== prevState.surveySections.length) {
      this.unsavedState  = true;
      this.lastSectionCount = prevState.surveySections.length;
    }
  }

  componentWillUnmount() {
    this.unsavedState = false;
    this.unbindHook();
  }

  routerWillLeave(nextLocation) {
    this.setState({ showModal: this.unsavedState });
    this.nextLocation = nextLocation;
    return !this.unsavedState;
  }

  handleConceptsChange(newConcepts) {
    this.setState({conceptsAttributes: filterConcepts(newConcepts)});
    this.unsavedState = true;
  }

  handleModalResponse(leavePage){
    this.setState({ showModal: false });
    if(leavePage){
      this.unsavedState = false;
      this.props.router.push(this.nextLocation.pathname);
    }else{
      let survey = Object.assign({}, this.state);
      // Because we were saving SurveySections with null positions for a while, we need to explicitly set position here to avoid sending a null position back to the server
      // At some point, we can remove this code
      survey.linkedSections = this.state.surveySections.map((sect, i) => ({id: sect.id, surveyId: sect.surveyId, sectionId: sect.sectionId, position: i}));
      this.props.surveySubmitter(survey, (response) => {
        // TODO: Handle when the saving survey fails.
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
    this.props.surveySubmitter(survey, (response) => {
      this.unsavedState = false;
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

  surveillanceSystem() {
    if (this.props.survey.surveillanceSystem) {
      return <p className="maincontent-item-info">Surveillance System: {this.props.survey.surveillanceSystem.name}</p>;
    } else {
      return "";
    }
  }

  surveillanceProgram() {
    if (this.props.survey.surveillanceProgram) {
      return <p className="maincontent-item-info">Surveillance Program: {this.props.survey.surveillanceProgram.name}</p>;
    } else {
      return "";
    }
  }

  render() {
    let num_dupes = 4;
    if(!this.props.sections){
      return ('Loading');
    }
    return (
      <div>
        <div className="maincontent-details">
          <h1 className="maincontent-item-name"><strong>Survey Name:</strong> {this.props.survey.name} </h1>
          <p className="maincontent-item-info">Version: {this.props.survey.version} - Author: {this.props.survey.userId} </p>
          {this.surveillanceProgram()}
          {this.surveillanceSystem()}
          <div>
            {this.props.survey.description}
          </div>
          <hr />
          <div className="import-note warning">
            <strong>Potential duplicate questions</strong><br />
            This survey contains draft questions which may be duplicates of existing questions in the Vocabulary Service.
            You may select an existing question to replace the suspected duplicate question in the survey.
          </div>

          <p>Note: This table will show all of the draft questions which we think might be dupes of existing published
          questions. They are grouped by their parent section. It is meant to give overall context to the user - let
          them see how many potential dupes they might have, where in the survey they are, etc.</p>
          
          <h4>Potential Duplicate Questions ({num_dupes})</h4>
          <table className="table table-dark-header">
            <thead>
              <tr>
                <th>Name &amp; Description</th>
                <th>Response Type</th>
                <th>Category</th>
                <th className="action"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="section-row">
                <td colSpan="4"><i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href="#">Personal Background Section</a> (3)<span className="sr-only">There are three potential duplicate questions in this section</span></td>
              </tr>
              <tr>
                <td><text>What was the principal reason for travel</text><br/><span className="small">Select the principal reason for travel</span></td>
                <td><a href="#"><i className={`fa ${iconMap['response_set']}`} aria-hidden="true"></i> Travel Reason (Hepatitis A)</a></td>
                <td>Epidemiological</td>
                <td><button className="btn btn-sm btn-default">View</button></td>
              </tr>
              <tr>
                <td><text>Mel quot tractatos necessitatibus ei</text><br/><span className="small">Ne mea agam oblique dolorum</span></td>
                <td><i className='fa fa-comments' aria-hidden="true"></i> String</td>
                <td>Demographics</td>
                <td><button className="btn btn-sm btn-default">View</button></td>
              </tr>
              <tr>
                <td><text>Semper nostro admodum cu sea, illum eligendi ut qui</text><br/><span className="small">Ne elitr recteque usu. Eu utamur corpora eos, eum no aeque viderer reprehendunt.</span></td>
                <td><a href="#"><i className={`fa ${iconMap['response_set']}`} aria-hidden="true"></i> Existing Response Set</a></td>
                <td>Epidemiological</td>
                <td><button className="btn btn-sm btn-default">View</button></td>
              </tr>
              <tr className="section-row">
                <td colSpan="4"><i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href="#">Second Parent Section</a> (1)<span className="sr-only">There is one potential duplicate question in this section</span></td>
              </tr>
              <tr>
                <td><text>What was the principal reason for travel</text><br/><span className="small">Select the principal reason for travel</span></td>
                <td><a href="#"><i className={`fa ${iconMap['response_set']}`} aria-hidden="true"></i> Travel Reason (Hepatitis A)</a></td>
                <td>Epidemiological</td>
                <td><button className="btn btn-sm btn-default">View</button></td>
              </tr>
            </tbody>
          </table>


          <p>Once the user clicks on the "View" button next to a question, they are shown the screen with the available suggested replacement questions.
          The "list all" link returns the user to the previous screen (see table above)</p>
          <div className="duplicate-nav-buttons">
            <button className="btn btn-default"><i className="fa fa-arrow-left"></i><span className="sr-only">Switch to the previous potential duplicate question</span></button>
            <button className="btn btn-default"><i className="fa fa-arrow-right"></i><span className="sr-only">Switch to the next potential duplicate question</span></button>
          </div>
          <h4>Viewing 1 of 4 Potential Duplicate Questions <a href="#">(List all)</a></h4>

          <div className="text-large"><i className={`fa ${iconMap['section']}`} aria-hidden="true"></i><text className="sr-only">Click to view parent section</text> <a href="#">Personal Background Section</a> (1 of 3)<span className="sr-only">There are three potential duplicate questions in this section</span></div>
          <table className="table">
            <thead>
              <tr className="active">
                <th>Name &amp; Description</th>
                <th>Response Type</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><text>What was the principal reason for travel</text><br/><span className="small">Select the principal reason for travel</span></td>
                <td><a href="#"><i className={`fa ${iconMap['response_set']}`} aria-hidden="true"></i> Travel Reason (Hepatitis A)</a></td>
                <td>Epidemiological</td>
              </tr>
            </tbody>
          </table>
          
          <p>NOTE: The list of suggested existing questions are hyperlinked to open in a new tab (for now) so the user may inspect the existing question before
          choosing to "select" it to replace the draft question. When they click "Select" they should get a confirmation dialog (not shown here)</p>
          <h4>Suggested Replacement Questions (3)</h4>

          <table className="table">
            <thead>
              <tr className="active">
                <th className="match-score">Match</th>
                <th>Name &amp; Description</th>
                <th>CDC Pref</th>
                <th>Response Type</th>
                <th>Category</th>
                <th className="text-center">Ref. Count</th>
                <th className="action"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="match-score">99</td>
                <td><a href="#">What was the principal reason for travel</a><br/><span className="small">Select the principal reason for travel</span></td>
                <td>CDC Pref logo</td>
                <td><i className={`fa ${iconMap['response_set']}`} aria-hidden="true"></i> Travel Reason (Hepatitis A)</td>
                <td>Epidemiological</td>
                <td className="text-center">14</td>
                <td><button className="btn btn-default btn-sm">Select</button></td>
              </tr>
              <tr>
                <td className="match-score">89</td>
                <td><a href="#">What was the primary reason for travel</a><br/><span className="small">Select the primary reason for travel</span></td>
                <td></td>
                <td><i className={`fa ${iconMap['response_set']}`} aria-hidden="true"></i> Travel Reason (Hepatitis A)</td>
                <td>Epidemiological</td>
                <td className="text-center">5</td>
                <td><button className="btn btn-default btn-sm">Select</button></td>
              </tr>
              <tr>
                <td className="match-score">70</td>
                <td><a href="#">What was the main reason for travel</a><br/><span className="small">Select the main reason for foreign travel</span></td>
                <td></td>
                <td><i className={`fa ${iconMap['response_set']}`} aria-hidden="true"></i> Travel Reason (Hepatitis A)</td>
                <td>Epidemiological</td>
                <td className="text-center">1</td>
                <td><button className="btn btn-default btn-sm">Select</button></td>
              </tr>
            </tbody>
          </table>
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

SurveyDedupe.propTypes = {
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

export default SurveyDedupe;
