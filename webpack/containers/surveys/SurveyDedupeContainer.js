import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap';

import { setSteps } from '../../actions/tutorial_actions';
import { fetchSurvey, fetchDuplicates } from '../../actions/survey_actions';
import { markAsDuplicate, linkToDuplicate } from '../../actions/questions_actions';
import { surveyProps } from '../../prop-types/survey_props';
import SurveyDedupe from '../../components/surveys/SurveyDedupe';
import currentUserProps from "../../prop-types/current_user_props";
import LoadingSpinner from '../../components/LoadingSpinner';
import BasicAlert from '../../components/BasicAlert';

class SurveyDedupeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchDuplicatesAttempted: false,
      fetchError: null
    };
    if (this.props.params.surveyId) {
      this.props.fetchSurvey(this.props.params.surveyId);
      this.props.fetchDuplicates(this.props.params.surveyId, (successResponse)=>{
        this.setState({fetchDuplicatesAttempted: successResponse.status === 200});
      }, (failureResponse)=>{
        this.setState({fetchError: failureResponse.message});
      });
    }
  }

  componentDidMount() {
    // TODO: Set Walkthrough Steps
    this.props.setSteps([
      {
        title: 'Help',
        text: 'Click next to see a step by step walkthrough for using this page. To see more detailed information about this application and actions you can take <a class="tutorial-link" href="#help">click here to view the full Help Documentation.</a> Accessible versions of these steps are also duplicated in the help documentation.',
        selector: '.help-link',
        position: 'bottom',
      }
    ]);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.surveyId != this.props.params.surveyId) {
      this.props.fetchSurvey(this.props.params.surveyId);
    }
    if(prevProps.potentialDupes !== this.props.potentialDupes) {
      this.props.fetchSurvey(this.props.params.surveyId);
    }
  }

  render() {
    if(this.state.fetchError) {
      return (
        <Grid className="basic-bg">
          <div className="import-action-message error" role="alert">
            Fetch duplicates failed: {this.state.fetchError} - send this code and the link to your system administrator at <a href="mailto:surveillanceplatform@cdc.gov">surveillanceplatform@cdc.gov</a>
          </div>
        </Grid>
      );
    } else if(!this.props.survey || !this.props.potentialDupes || !this.state.fetchDuplicatesAttempted){
      return (
        <Grid className="basic-bg">
          <Row>
            <Col xs={12}>
              <div>
                <LoadingSpinner msg={!this.state.fetchDuplicatesAttempted ? "Finding Duplicates..." : "Loading survey..."} />
                <p>If not redirected there may no longer be any duplicates detected for this survey - try refreshing or contacting an administrator)</p>
              </div>
              {this.props.loadStatus === 'failure' &&
                <BasicAlert msg={this.props.loadStatusText} severity='danger' />
              }
            </Col>
          </Row>
        </Grid>

      );
    }
    return (
      <Grid className="survey-edit-container">
        <Row>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h1 className="panel-title">Curate Survey Content</h1>
            </div>
            <div className="panel-body">
              <Row>
                <Col md={12}>
                  <SurveyDedupe ref='survey'
                                survey={this.props.survey}
                                potentialDupes={this.props.potentialDupes}
                                markAsDuplicate={this.props.markAsDuplicate}
                                linkToDuplicate={this.props.linkToDuplicate}
                                currentUser={this.props.currentUser} />
                </Col>
              </Row>
            </div>
          </div>
        </Row>
      </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, fetchSurvey, fetchDuplicates, markAsDuplicate, linkToDuplicate}, dispatch);
}

function mapStateToProps(state, ownProps) {
  const survey = state.surveys[ownProps.params.surveyId||0];
  return {
    survey: survey,
    potentialDupes: state.potentialDupes,
    currentUser: state.currentUser,
    isLoading : state.ajaxStatus.survey.isLoading,
    loadStatus : state.ajaxStatus.survey.loadStatus,
    loadStatusText : state.ajaxStatus.survey.loadStatusText

  };
}

SurveyDedupeContainer.propTypes = {
  survey: surveyProps,
  potentialDupes: PropTypes.array,
  params: PropTypes.object.isRequired,
  setSteps: PropTypes.func,
  fetchSurvey: PropTypes.func,
  fetchDuplicates: PropTypes.func,
  markAsDuplicate: PropTypes.func,
  isLoading: PropTypes.bool,
  loadStatus : PropTypes.string,
  loadStatusText : PropTypes.string,
  linkToDuplicate: PropTypes.func,
  currentUser: currentUserProps,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyDedupeContainer);
