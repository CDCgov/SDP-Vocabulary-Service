import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import values from 'lodash/values';
import { Grid, Row, Col, Button } from 'react-bootstrap';

import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { newSurvey, fetchSurvey, saveSurvey, saveDraftSurvey } from '../../actions/survey_actions';
import { removeSection, reorderSection } from '../../actions/section_actions';
import { sectionsProps }  from '../../prop-types/section_props';
import { questionsProps }  from '../../prop-types/question_props';
import { surveyProps } from '../../prop-types/survey_props';
import { surveillanceSystemsProps } from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';
import SurveyEdit from '../../components/surveys/SurveyEdit';
import currentUserProps from "../../prop-types/current_user_props";
import SectionSearchContainer from '../sections/SectionSearchContainer';
import InfoModal from '../../components/InfoModal';

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
        text: 'Edit the various survey details on the right side of the page. Select save in the top right of the page when done editing to save a private draft of the content (this content will not be public until it is published).',
        selector: '.survey-edit-details',
        position: 'left',
      },
      {
        title: 'Code System Mappings Table',
        text: 'Click the info (i) icon, or <a class="tutorial-link" href="#help">go to the full help documentation</a> to see more information and examples on how to get the most out of code mappings.',
        selector: '.code-system-mappings-table-header',
        position: 'left',
      }]);
  }

  actionWord() {
    const wordMap = {'new': 'Create', 'revise': 'Revise', 'extend': 'Extend', 'edit': 'Edit'};
    return wordMap[this.props.params.action || 'new'];
  }

  componentDidUpdate(prevProps) {
    if(this.props.params.surveyId && (prevProps.params.surveyId != this.props.params.surveyId)){
      this.props.fetchSurvey(this.props.params.surveyId);
    }
    if(this.props.survey && this.props.survey.surveySections) {
      this.refs.survey.setState(Object.assign(this.refs.survey.state, {surveySections: this.props.survey.surveySections}));
    }
  }

  render() {
    if(!this.props.survey || !this.props.sections || this.props.isLoading || this.props.loadStatus == 'failure'){
      return (
        <Grid className="basic-bg">
          <Row>
            <Col xs={12}>
              {this.props.isLoading && <LoadingSpinner msg="Loading survey..." />}
              {this.props.loadStatus == 'failure' &&
                <BasicAlert msg={this.props.loadStatusText} severity='danger' />
              }
              {this.props.loadStatus == 'success' &&
               <BasicAlert msg="Sorry, there is a problem loading this survey." severity='warning' />
              }
            </Col>
          </Row>
        </Grid>
      );
    }

    return (
      <Grid className="survey-edit-container xxx">
        <Row>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">{`${this.actionWord()} Survey`}</h1>
            </div>
            <div className="panel-body">
            <InfoModal show={this.state.showInfoSearchandSelectSections} header="Search and Select Sections" body={<p>Search through existing Sections in the system to identify the content that composes a specific SDP-V survey. A SDP-V Survey defines the vocabulary (e.g., Sections that include groupings of related  Questions and Response Sets) used for a particular data collection or information exchange. An SDP-V Survey contains one or more Sections that are intended for a data collection instrument or information exchange.<br/><br/>Existing Sections in the repository can be searched and selected for use. To select a specific Section, click the blue “+” button. Once added, the “+” sign will change into a checkmark to indicate the Section will be added to this Section after save.
            <br/><br/><strong>Can’t find an existing section to use?</strong> After searching the service, if no suitable sections are found, a user can create a new section by returning to the dashboard and selecting the “Create” menu and “Section”. After creating the new Section, it will appear in the section search results and can be added to a SDP-V Survey.</p>} hideInfo={()=>this.setState({showInfoSearchandSelectSections: false})} />
            <label htmlFor="searchAndSelectSections">Search and Select Sections<Button bsStyle='link' onClick={() => this.setState({showInfoSearchandSelectSections: true})}><i className="fa fa-info-circle" aria-hidden="true"></i><text className="sr-only">Click for info about this item</text></Button></label>
              <Row>
              <Col md={5}>
                <SectionSearchContainer survey  ={this.props.survey}
                                     allSections={values(this.props.sections)}
                                     currentUser={this.props.currentUser}
                                     selectedSearchResults={this.props.selectedSearchResults} />
              </Col>
              <SurveyEdit ref='survey' survey={this.props.survey}
                          action={this.props.params.action || 'new'}
                          stats={this.props.stats}
                          setStats={this.props.setStats}
                          route ={this.props.route}
                          router={this.props.router}
                          sections ={this.props.sections}
                          questions  ={this.props.questions}
                          removeSection ={this.props.removeSection}
                          reorderSection={this.props.reorderSection}
                          currentUser={this.props.currentUser}
                          surveillanceSystems={this.props.surveillanceSystems}
                          surveillancePrograms={this.props.surveillancePrograms}
                          surveySubmitter={this.state.selectedSurveySaver} />
              </Row>
            </div>
          </div>
        </Row>
      </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, newSurvey, removeSection, reorderSection,
    saveSurvey, saveDraftSurvey, fetchSurvey, setStats}, dispatch);
}

function mapStateToProps(state, ownProps) {
  const survey = state.surveys[ownProps.params.surveyId||0];
  let sections = state.sections;
  var selectedSearchResults = {};
  if(survey && survey.surveySections){
    survey.surveySections.map((ss)=>{
      selectedSearchResults[ss.sectionId] = true;
      const sectionWithNestedItems = Object.assign({}, sections[ss.sectionId]);
      if (sectionWithNestedItems.sectionNestedItems && sectionWithNestedItems.sectionNestedItems[0]) {
        sectionWithNestedItems.sectionNestedItems = sectionWithNestedItems.sectionNestedItems.map((sni) => {
          let fullNestedItem = {};
          if (sni.questionId && state.questions[sni.questionId]) {
            fullNestedItem = state.questions[sni.questionId];
            fullNestedItem.type = 'question';
            return fullNestedItem;
          } else if (sni.nestedSectionId && state.sections[sni.nestedSectionId]) {
            fullNestedItem = state.sections[sni.nestedSectionId];
            fullNestedItem.type = 'section';
            return fullNestedItem;
          } else {
            return sni;
          }
        });
      }
      sections[ss.sectionId] = sectionWithNestedItems;
    });
  }
  return {
    survey: survey,
    sections:  sections,
    questions: state.questions,
    stats: state.stats,
    currentUser: state.currentUser,
    surveillanceSystems:  state.surveillanceSystems,
    surveillancePrograms: state.surveillancePrograms,
    selectedSearchResults: selectedSearchResults,
    isLoading: state.ajaxStatus.survey.isLoading,
    loadStatus: state.ajaxStatus.survey.loadStatus,
    loadStatusText : state.ajaxStatus.survey.loadStatusText
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
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  removeSection:  PropTypes.func,
  reorderSection: PropTypes.func,
  currentUser: currentUserProps,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps,
  saveDraftSurvey: PropTypes.func,
  selectedSearchResults: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyEditContainer);
