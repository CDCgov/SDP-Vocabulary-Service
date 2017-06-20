import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import values from 'lodash/values';
import capitalize from 'lodash/capitalize';

import { fetchQuestions } from '../actions/questions_actions';
import { setSteps } from '../actions/tutorial_actions';
import { newSurvey, fetchSurvey, saveSurvey, saveDraftSurvey } from '../actions/survey_actions';
import { removeForm, reorderForm } from '../actions/form_actions';
import { formsProps }  from '../prop-types/form_props';
import { questionsProps }  from '../prop-types/question_props';
import { surveyProps } from '../prop-types/survey_props';
import SurveyEdit from '../components/SurveyEdit';
import currentUserProps from "../prop-types/current_user_props";
import FormSearchContainer from './FormSearchContainer';

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
        title: 'Form Search',
        text: 'Type in your search keywords here to search for forms to add to the survey.',
        selector: '.search-group',
        position: 'right',
      },
      {
        title: 'Advanced Search Filters',
        text: 'Click Advanced to see additional filters you can apply to your search.',
        selector: '.adv-search-link',
        position: 'right',
      },
      {
        title: 'Form Result',
        text: 'Use these search results to find the form you want to add.',
        selector: '.u-result',
        position: 'right',
      },
      {
        title: 'Add Form',
        text: 'Click on the add button to select a form for the survey.',
        selector: '.fa-plus-square',
        position: 'right',
      },
      {
        title: 'Survey Details',
        text: 'Edit the various survey details on the right side of the page. Select save in the top right of the page when done editing to save a draft of the content.',
        selector: '.survey-edit-details',
        position: 'left',
      }]);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.surveyId != this.props.params.surveyId){
      this.props.fetchSurvey(this.props.params.surveyId);
    }
    if(this.props.survey && this.props.survey.surveyForms) {
      this.refs.survey.setState(Object.assign(this.refs.survey.state, {surveyForms: this.props.survey.surveyForms}));
    }
  }

  render() {
    if(!this.props.survey || !this.props.forms){
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div className="container survey-edit-container">
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">{capitalize(this.props.params.action)} Survey </h1>
            </div>
            <div className="panel-body">
              <div className="col-md-5">
                <FormSearchContainer survey  ={this.props.survey}
                                     allForms={values(this.props.forms)}
                                     currentUser={this.props.currentUser} />
              </div>
              <SurveyEdit ref='survey' survey={this.props.survey}
                          action={this.props.params.action || 'new'}
                          route ={this.props.route}
                          router={this.props.router}
                          forms ={this.props.forms}
                          questions  ={this.props.questions}
                          removeForm ={this.props.removeForm}
                          reorderForm={this.props.reorderForm}
                          surveySubmitter={this.state.selectedSurveySaver} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, newSurvey, removeForm, reorderForm,
    saveSurvey, saveDraftSurvey, fetchSurvey, fetchQuestions}, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {
    survey: state.surveys[ownProps.params.surveyId||0],
    forms:  state.forms,
    questions: state.questions,
    currentUser: state.currentUser
  };
}

SurveyEditContainer.propTypes = {
  survey: surveyProps,
  forms:  formsProps,
  questions: questionsProps,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  setSteps:    PropTypes.func,
  newSurvey:   PropTypes.func,
  saveSurvey:  PropTypes.func,
  fetchSurvey: PropTypes.func,
  removeForm:  PropTypes.func,
  reorderForm: PropTypes.func,
  currentUser: currentUserProps,
  saveDraftSurvey: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyEditContainer);
