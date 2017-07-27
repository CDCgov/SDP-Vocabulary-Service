import {
  PUBLISH_SURVEY_FULFILLED,
  SAVE_DRAFT_SURVEY_FULFILLED,
  DELETE_SURVEY_FULFILLED,
  ADD_FORM,
  REMOVE_FORM,
  REORDER_FORM,
  CREATE_SURVEY,
  ADD_ENTITIES_FULFILLED
} from '../actions/types';
import * as helpers from './helpers';

export default function surveys(state = {}, action) {
  let survey, newState, newSurvey, form;
  switch (action.type) {
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.surveys);
    case PUBLISH_SURVEY_FULFILLED:
    case SAVE_DRAFT_SURVEY_FULFILLED:
      return helpers.fetchIndividual(state, action);
    case CREATE_SURVEY:
      newState = Object.assign({}, state);
      newState[0] = {surveyForms: [], forms: [], version: 1, id: 0};
      return newState;
    case ADD_FORM:
      form = action.payload.form;
      survey = action.payload.survey;
      survey.id = survey.id || 0;
      if(state[survey.id] && state[survey.id].surveyForms.findIndex( (s) => s.formId == form.id) > -1){
        return state;
      }
      let newSurveyForm = Object.assign({}, {formId: form.id, surveyId: survey.id, position: survey.surveyForms.length});
      newSurvey = Object.assign({}, survey);
      newSurvey.surveyForms.push(newSurveyForm);
      newState = Object.assign({}, state);
      newState[survey.id] = newSurvey;
      return newState;
    case REMOVE_FORM:
      return helpers.removeNestedItem(state, action, 'survey', 'surveyForms');
    case REORDER_FORM:
      return helpers.reorderNestedItem(state, action, 'survey', 'surveyForms');
    case DELETE_SURVEY_FULFILLED:
      return helpers.deleteItem(state, action);
    default:
      return state;
  }
}
