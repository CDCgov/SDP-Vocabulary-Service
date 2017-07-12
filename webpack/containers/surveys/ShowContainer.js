import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSurvey, publishSurvey, deleteSurvey } from '../../actions/survey_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import SurveyShow from '../../components/surveys/Show';
import { surveyProps } from '../../prop-types/survey_props';
import { formProps } from '../../prop-types/form_props';
import CommentList from '../../containers/CommentList';
import currentUserProps from '../../prop-types/current_user_props';
import { publishersProps } from "../../prop-types/publisher_props";

class SurveyShowContainer extends Component {
  componentWillMount() {
    this.props.fetchSurvey(this.props.params.surveyId);
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
        title: 'Version Navigation',
        text: 'Use the history side bar to switch between revisions of an item if more than one exists.',
        selector: '.nav-stacked',
        position: 'right',
      },
      {
        title: 'View Details',
        text: 'See all of the details including linked items on this section of the page. Use the buttons in the top right to do various actions with the content depending on your user permissions. For full details on what an action does please see the "Create and Edit Content" section of the <a class="tutorial-link" href="#help">Help Documentation (linked here).</a>',
        selector: '.maincontent',
        position: 'left',
      },
      {
        title: 'Comment Threads',
        text: 'At the bottom of each details page is a section for public comments. People can view and respond to these comments in threads on published content.',
        selector: '.showpage-comments-title',
        position: 'top',
      }]);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.surveyId != this.props.params.surveyId){
      this.props.fetchSurvey(this.props.params.surveyId);
    }
  }

  render() {
    if(!this.props.survey){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <SurveyShow {...this.props} />
            <div className="col-md-12 showpage-comments-title">Public Comments:</div>
            <CommentList commentableType='Survey' commentableId={this.props.survey.id} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.currentUser = state.currentUser;
  props.publishers = state.publishers;
  props.stats = state.stats;
  props.survey = state.surveys[ownProps.params.surveyId];
  if (props.survey) {
    props.forms = props.survey.surveyForms.map((form) => state.forms[form.formId]);
    props.forms = props.forms.filter((f) => f !== undefined);
    props.forms = props.forms.map((f) => {
      const formWithQuestions = Object.assign({}, f);
      if (formWithQuestions.formQuestions) {
        formWithQuestions.questions = formWithQuestions.formQuestions.map((fq) => state.questions[fq.questionId]);
      }
      return formWithQuestions;
    });
    if (props.survey.surveillanceSystemId) {
      props.survey.surveillanceSystem = state.surveillanceSystems[props.survey.surveillanceSystemId];
    }
    if (props.survey.surveillanceProgramId) {
      props.survey.surveillanceProgram = state.surveillancePrograms[props.survey.surveillanceProgramId];
    }
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSteps, setStats, publishSurvey, fetchSurvey, deleteSurvey}, dispatch);
}

SurveyShowContainer.propTypes = {
  survey: surveyProps,
  forms: PropTypes.arrayOf(formProps),
  currentUser: currentUserProps,
  fetchSurvey: PropTypes.func,
  publishSurvey: PropTypes.func,
  deleteSurvey: PropTypes.func,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object,
  stats: PropTypes.object,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyShowContainer);
