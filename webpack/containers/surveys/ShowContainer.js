import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSurvey } from '../../actions/survey_actions';
import { fetchForms } from '../../actions/form_actions';
import { fetchQuestions } from '../../actions/questions_actions';
import SurveyShow from '../../components/surveys/Show';
// import { surveyProps } from '../prop-types/survey_props';
import CommentList from '../../containers/CommentList';
import currentUserProps from '../../prop-types/current_user_props';

class SurveyShowContainer extends Component {
  componentWillMount() {
    // Only grabbing forms the first time this loads.
    // If we create a new form it'll already be in store.
    this.props.fetchForms();
    this.props.fetchQuestions();
    this.props.fetchSurvey(this.props.params.surveyId);


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
            <SurveyShow/>
            <div className="col-md-12 showpage-comments-title">Comments:</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.currentUser = state.currentUser;
  props.survey = state.surveys[ownProps.params.surveyId];
  // if (props.survey) {
  //   props.forms = props.survey.surveyForms.map((form) => state.forms[form.formId]);
  //   // TODO Figure out a way to make this less ugly
  //   let questionIds = [].concat(...props.forms.map((f) => [].concat(...f.questions.map((q) => q.id))))
  //   props.questions = questionIds.map((qId) => state.questions[qId]);
  // }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchSurvey, fetchForms, fetchQuestions}, dispatch);
}

SurveyShowContainer.propTypes = {
  // survey: surveyProps,
  currentUser: currentUserProps,
  fetchSurvey: PropTypes.func,
  fetchQuestions: PropTypes.func,
  fetchForms: PropTypes.func,
  params: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyShowContainer);
