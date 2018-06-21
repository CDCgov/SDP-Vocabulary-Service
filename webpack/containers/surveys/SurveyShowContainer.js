import React, { Component } from 'react';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSurvey, publishSurvey, retireSurvey, addSurveyToGroup, removeSurveyFromGroup, deleteSurvey, updateSurveyTags } from '../../actions/survey_actions';
import { setSteps } from '../../actions/tutorial_actions';
import { setStats } from '../../actions/landing';
import { addPreferred, removePreferred } from '../../actions/preferred_actions';
import SurveyShow from '../../components/surveys/SurveyShow';
import { surveyProps } from '../../prop-types/survey_props';
import { surveySchema } from '../../schema';
import { sectionProps } from '../../prop-types/section_props';
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
        selector: '.action_bar',
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
  props.survey = denormalize(state.surveys[ownProps.params.surveyId], surveySchema, state);
  if (props.survey && props.survey.surveySections) {
    props.sections = props.survey.surveySections.map((section) => state.sections[section.sectionId]);
    props.sections = props.sections.filter((sect) => sect !== undefined);
    props.sections = props.sections.map((sect) => {
      const sectionWithNestedItems = Object.assign({}, sect);
      if (sectionWithNestedItems.sectionNestedItems) {
        sectionWithNestedItems.sectionNestedItems = sectionWithNestedItems.sectionNestedItems.map((sni) => {
          let fullNestedItem = {};
          if (sni.questionId) {
            fullNestedItem = state.questions[sni.questionId];
            fullNestedItem.type = 'question';
            return fullNestedItem;
          } else if (sni.nestedSectionId) {
            fullNestedItem = state.sections[sni.nestedSectionId];
            fullNestedItem.type = 'section';
            return fullNestedItem;
          }
        });
      }
      return sectionWithNestedItems;
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
  return bindActionCreators({setSteps, setStats, publishSurvey, retireSurvey, addSurveyToGroup, addPreferred, removePreferred,
    removeSurveyFromGroup, fetchSurvey, deleteSurvey, updateSurveyTags}, dispatch);
}

SurveyShowContainer.propTypes = {
  survey: surveyProps,
  sections: PropTypes.arrayOf(sectionProps),
  currentUser: currentUserProps,
  fetchSurvey: PropTypes.func,
  publishSurvey: PropTypes.func,
  retireSurvey: PropTypes.func,
  addSurveyToGroup: PropTypes.func,
  removeSurveyFromGroup: PropTypes.func,
  addPreferred: PropTypes.func,
  removePreferred: PropTypes.func,
  updateSurveyTags: PropTypes.func,
  deleteSurvey: PropTypes.func,
  setSteps: PropTypes.func,
  setStats: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object,
  stats: PropTypes.object,
  publishers: publishersProps
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyShowContainer);
