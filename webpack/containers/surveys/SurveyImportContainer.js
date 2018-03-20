import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import values from 'lodash/values';

import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { newSurvey, fetchSurvey, saveSurvey, saveDraftSurvey } from '../../actions/survey_actions';
import { removeSection, reorderSection } from '../../actions/section_actions';
import { sectionsProps }  from '../../prop-types/section_props';
import { questionsProps }  from '../../prop-types/question_props';
import { surveyProps } from '../../prop-types/survey_props';
import { surveillanceSystemsProps } from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';
import SurveyEdit from '../../components/surveys/SurveyEdit';
import currentUserProps from "../../prop-types/current_user_props";
import SectionSearchContainer from '../sections/SectionSearchContainer';

class SurveyEditContainer extends Component {
  constructor(props) {
    super(props);
    let selectedSurveySaver = this.props.saveSurvey;
    if (this.props.params.surveyId) {
      this.props.fetchSurvey(this.props.params.surveyId);
      if (this.props.params.action === 'edit') {
        selectedSurveySaver = this.props.saveDraftSurvey;
      }
    } else {
      this.props.newSurvey();
      this.props.params.surveyId = 0;
      this.props.params.action = 'new';
    }
    this.state = {selectedSurveySaver: selectedSurveySaver};
  }

  componentDidMount() {
    this.props.setSteps([
      {
        title: 'Help',
        text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
        selector: '.help-link',
        position: 'bottom',
      },
      {
        title: 'Section Search',
        text: 'Type in your search keywords here to search for sections to add to the survey.',
        selector: '.search-input',
        position: 'bottom',
      },
      {
        title: 'Advanced Search Filters',
        text: 'Click Advanced to see additional filters you can apply to your search.',
        selector: '.search-group',
        position: 'right',
      },
      {
        title: 'Section Search Result',
        text: 'Use these search results to find the section you want to add.',
        selector: '.u-result',
        position: 'right',
      },
      {
        title: 'Add Section',
        text: 'Click on the add (+) button to select a section for the survey.',
        selector: '.fa-plus-square',
        position: 'bottom',
      },
      {
        title: 'Survey Details',
        text: 'Edit the various survey details on the right side of the page. Select save in the top right of the page when done editing to save a draft of the content (this content will not be public until it is published).',
        selector: '.survey-edit-details',
        position: 'left',
      },
      {
        title: 'Tags Table',
        text: 'The purpose of Tags is to facilitate content discovery and reuse. Click the info (i) icon, or <a class="tutorial-link" href="#help">go to the full help documentation</a> to see more information and examples on how to get the most out of tags.',
        selector: '.tags-table-header',
        position: 'left',
      }]);
  }

  actionWord() {
    const wordMap = {'new': 'Create', 'revise': 'Revise', 'extend': 'Extend', 'edit': 'Edit'};
    return wordMap[this.props.params.action || 'new'];
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.surveyId != this.props.params.surveyId){
      this.props.fetchSurvey(this.props.params.surveyId);
    }
    if(this.props.survey && this.props.survey.surveySections) {
      this.refs.survey.setState(Object.assign(this.refs.survey.state, {surveySections: this.props.survey.surveySections}));
    }
  }

 
    render() {
    if(!this.props.survey || !this.props.sections){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">Import MMG Spreadsheet</h1>
            </div>

            <div className="panel-body">
              <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
              <div className="drag-drop-target">
                <p><span className="fa fa-file-o"></span> Drag and drop MMG Excel Spreadsheet file here (.xls, .xlsx, .xslm)</p>
                <a href="#">(Select using system file dialog)</a>
              </div>

              <div className="import-action-area">
                <h2>Files to be imported</h2>

                <div className="import-file-info">
                  <dl className="dl-horizontal">
                    <dt>Filename:</dt>
                    <dd>Hepatitis_V1.0_MMG_F_R3_20170317.xslx</dd>
                    <dt>Size:</dt>
                    <dd>399,323 bytes</dd>
                    <dt>Last Updated:</dt>
                    <dd>2018-03-19 11:34:20am</dd>
                  </dl>
              </div>
              
              <div className="import-action-message success" role="alert">
                  <button className="btn btn-primary">Import</button>
                  <button className="btn btn-default">Cancel</button>
                File recognized as MMG Excel spreadsheet
              </div>
              
              <div className="import-action-message error" role="alert">
                  <button className="btn btn-default">Replace</button>
                  <button className="btn btn-default"><span className="fa fa-trash"></span> Remove</button>
                File not recognized as MMG Excel spreadsheet
              </div>
              
              <div className="import-notes">
              <div className="import-note error">
                <strong>Error</strong>: Missing column header<br />
                Could not find the expected column "data-element-name"
              </div>
              
              <div className="import-note error">
                <strong>Error</strong>: Missing value for section name<br />
                Could not find value for Section name.<br />
                Tab "Hepatitis Core Data Elements", row 13
              </div>
              </div>
              
              <div className="import-progress">
                <h3>Importing</h3>
                <div className="import-progress--bar">
                <div className="import-progress--progress"></div>
                </div>
              </div>
              
              <div className="import-action-message success" role="alert">
                  <button className="btn btn-primary">View Survey</button>
                File successfully imported
              </div>

              <div className="import-action-message error" role="alert">
                  <button className="btn btn-default"><span className="fa fa-trash"></span> Remove</button>
                File could not be imported
              </div>
              <div className="import-action-message warning" role="alert">
                  <button className="btn btn-primary">View Survey</button>
                File imported with warnings
              </div>

              <div className="import-notes">
                <div className="import-note error">
                  <strong>Error</strong>: Unrecognized format in Blah blah blah<br />
                  Was expecting a Text value in column Blah<br />
                  <span className="import-location">Tab "Hepatitis B-Chronic DE", row 18</span>
                </div>

                <div className="import-note error">
                  <strong>Error</strong>: Missing value for section name<br />
                  Could not find value for Section name.<br />
                  Tab "Hepatitis Core Data Elements", row 13
                </div>

              </div>              

              <div className="import-notes">
                <div className="import-note warning">
                  <strong>Warning</strong>: Section End row missing<br />
                  Was expecting an "End" row for section "Interprative Liver Enzyme Testing Repeating Group", but no row was found<br />
                  Tab "Hepatitis B-Chronic DE", row 21
                </div>
              </div>              

              <div className="import-results">
                <table className="table table-condensed table-striped table-bordered survey-table">
                  <thead>
                    <tr>
                      <th>Data element name</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Value Set Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="section-row">
                      <td colSpan="4">Section: EPIDEMIOLOGIC INFORMATION SECTION</td>
                    </tr>
                    <tr>
                      <td>Reason for testing</td>
                      <td>Listing of the reason(s) the subject was tested for Hepatitis. If "Other" has been selected as coded value, specify the free text using "Other Reason for Testing"  data element.</td>
                      <td>Coded</td>
                      <td>Reason for Test (Hepatitis)</td>
                    </tr>
                    <tr>
                      <td>Other Reason for Testing</td>
                      <td>Other reason(s) the subject was tested for Hepatitis (Free text).</td>
                      <td>Text</td>
                      <td>N/A</td>
                     </tr>
                     <tr>
                      <td>Symtompatic</td>
                      <td>Was the subject symptomatic for Hepatitis.</td>
                      <td>Coded</td>
                      <td>Yes No Unknown (YNU)</td>
                     </tr>
                     <tr>
                      <td>Jaundiced (Symptom)</td>
                      <td>Was the subject jaundiced.</td>
                      <td>Coded</td>
                      <td>Yes No Unknown (YNU)</td>
                     </tr>
                     <tr>
                      <td>Due Date</td>
                      <td>Subject's pregnancy due date.</td>
                      <td>Date</td>
                      <td>N/A</td>
                     </tr>
                     <tr>
                      <td>Previously Aware of Condition</td>
                      <td>Was the subject aware they had Hepatitis prior to lab testing.</td>
                      <td>Coded</td>
                      <td>Yes No Unknown (YNU)</td>
                     </tr>
                     <tr>
                      <td>Provider of Care for Condition</td>
                      <td>Does the subject have a provider of care for Hepatitis? This is any healthcare provider that monitors or treats the patient for viral Hepatitis.</td>
                      <td>Coded</td>
                      <td>Yes No Unknown (YNU)</td>
                     </tr>
                     <tr>
                      <td>Diabetes</td>
                      <td>Does subject have diabetes?</td>
                      <td>Coded</td>
                      <td>Yes No Unknown (YNU)</td>
                     </tr>
                    </tbody>
                  </table>
              </div>

              
            </div>
            </div>

          </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
  
  
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, newSurvey, removeSection, reorderSection,
    saveSurvey, saveDraftSurvey, fetchSurvey, setStats}, dispatch);
}

function mapStateToProps(state, ownProps) {
  const survey = state.surveys[ownProps.params.surveyId||0];
  var selectedSearchResults = {};
  if(survey && survey.surveySections){
    survey.surveySections.map((ss)=>{
      selectedSearchResults[ss.sectionId] = true;
    });
  }
  return {
    survey: survey,
    sections:  state.sections,
    questions: state.questions,
    stats: state.stats,
    currentUser: state.currentUser,
    surveillanceSystems:  state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    selectedSearchResults: selectedSearchResults
  };
}

SurveyEditContainer.propTypes = {
  survey: surveyProps,
  sections:  sectionsProps,
  questions: questionsProps,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  setSteps:    PropTypes.func,
  setStats: PropTypes.func,
  stats: PropTypes.object,
  newSurvey:   PropTypes.func,
  saveSurvey:  PropTypes.func,
  fetchSurvey: PropTypes.func,
  removeSection:  PropTypes.func,
  reorderSection: PropTypes.func,
  currentUser: currentUserProps,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps,
  saveDraftSurvey: PropTypes.func,
  selectedSearchResults: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyEditContainer);
