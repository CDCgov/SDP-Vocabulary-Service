import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchForms } from '../actions/form_actions';
import { newSurvey, fetchSurvey, saveSurvey, saveDraftSurvey, removeForm, reorderForm } from '../actions/survey_actions';
import { formsProps } from '../prop-types/form_props';
import { surveyProps } from '../prop-types/survey_props';
import SurveyEdit from '../components/SurveyEdit';
import currentUserProps from "../prop-types/current_user_props";
import FormSearchContainer from './FormSearchContainer';

import _ from 'lodash';

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

  componentWillMount() {
    this.props.fetchSurvey();
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
      <div className="container">
        <div className="row">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">{_.capitalize(this.props.params.action)} Survey </h3>
            </div>
            <div className="panel-body">
              <div className="col-md-4">
                <FormSearchContainer survey  ={this.props.survey}
                                     allForms={_.values(this.props.forms)}
                                     currentUser={this.props.currentUser} />
              </div>
              <SurveyEdit ref='survey' survey={this.props.survey}
                          action={this.props.params.action || 'new'}
                          route ={this.props.route}
                          router={this.props.router}
                          forms ={this.props.forms}
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
  return bindActionCreators({newSurvey, fetchForms, removeForm, reorderForm,
    saveSurvey, saveDraftSurvey, fetchSurvey}, dispatch);
}

function mapStateToProps(state, ownProps) {
  return {
    survey: state.surveys[ownProps.params.surveyId||0],
    forms: state.forms,
    currentUser: state.currentUser
  };
}

SurveyEditContainer.propTypes = {
  survey: surveyProps,
  forms:  formsProps,
  route:  PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  newSurvey:   PropTypes.func,
  saveSurvey:  PropTypes.func,
  fetchSurvey: PropTypes.func,
  fetchForms:  PropTypes.func,
  removeForm:  PropTypes.func,
  reorderForm: PropTypes.func,
  currentUser: currentUserProps,
  saveDraftSurvey: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyEditContainer);
