import {
  PUBLISH_SURVEY_FULFILLED,
  RETIRE_SURVEY_FULFILLED,
  SAVE_DRAFT_SURVEY_FULFILLED,
  DELETE_SURVEY_FULFILLED,
  ADD_SECTION,
  REMOVE_SECTION,
  REORDER_SECTION,
  CREATE_SURVEY,
  ADD_ENTITIES_FULFILLED,
  ADD_ENTITIES_PENDING,
  ADD_ENTITIES_REJECTED,
  ADD_SURVEY_TO_GROUP_FULFILLED,
  REMOVE_SURVEY_FROM_GROUP_FULFILLED,
  UPDATE_STAGE_SURVEY_FULFILLED,
  UPDATE_SURVEY_TAGS_FULFILLED,
  FETCH_SURVEY_SUCCESS,
  FETCH_SURVEY_FAILURE
} from '../actions/types';
import * as helpers from './helpers';

export default function surveys(state = {}, action) {
  let survey, newState, newSurvey, section, loadStatusText;
  switch (action.type) {
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.surveys);
    case ADD_ENTITIES_REJECTED:
      return Object.assign({},state);
    case ADD_ENTITIES_PENDING:
      return Object.assign({},state);
    case PUBLISH_SURVEY_FULFILLED:
    case RETIRE_SURVEY_FULFILLED:
    case SAVE_DRAFT_SURVEY_FULFILLED:
    case UPDATE_SURVEY_TAGS_FULFILLED:
    case UPDATE_STAGE_SURVEY_FULFILLED:
    case ADD_SURVEY_TO_GROUP_FULFILLED:
    case REMOVE_SURVEY_FROM_GROUP_FULFILLED:
      return helpers.fetchIndividual(state, action);
    case CREATE_SURVEY:
      newState = Object.assign({}, state);
      newState[0] = {surveySections: [], sections: [], version: 1, id: 0};
      return newState;
    case ADD_SECTION:
      section = action.payload.section;
      survey = action.payload.survey;
      survey.id = survey.id || 0;
      if(state[survey.id] && state[survey.id].surveySections && state[survey.id].surveySections.findIndex( (s) => s.sectionId == section.id) > -1){
        return state;
      }
      if(!survey.surveySections) {
        survey.surveySections = [];
      }
      let newSurveySection = Object.assign({}, {sectionId: section.id, surveyId: survey.id, position: survey.surveySections.length});
      newSurvey = Object.assign({}, survey);
      newSurvey.surveySections.push(newSurveySection);
      newState = Object.assign({}, state);
      newState[survey.id] = newSurvey;
      return newState;
    case REMOVE_SECTION:
      return helpers.removeNestedItem(state, action, 'survey', 'surveySections');
    case REORDER_SECTION:
      return helpers.reorderNestedItem(state, action, 'survey', 'surveySections');
    case DELETE_SURVEY_FULFILLED:
      return helpers.deleteItem(state, action);
    default:
      return state;
  }
}
