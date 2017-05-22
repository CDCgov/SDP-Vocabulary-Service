import {
  FETCH_SURVEY_FULFILLED,
  FETCH_SURVEYS_FULFILLED,
  PUBLISH_SURVEY_FULFILLED,
  SAVE_DRAFT_SURVEY_FULFILLED,
  ADD_FORM,
  REMOVE_FORM,
  REORDER_FORM,
  CREATE_SURVEY
} from '../actions/types';
import _ from 'lodash';

export default function surveys(state = {}, action) {
  let survey , index, newState, newSurvey, direction, form;
  switch (action.type) {
    case FETCH_SURVEYS_FULFILLED:
      return Object.assign({}, state, _.keyBy(action.payload.data, 'id'));
    case PUBLISH_SURVEY_FULFILLED:
    case SAVE_DRAFT_SURVEY_FULFILLED:
    case FETCH_SURVEY_FULFILLED:
      const surveyClone = Object.assign({}, state);
      surveyClone[action.payload.data.id] = action.payload.data;
      return surveyClone;
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
      let newSurveyForm = Object.assign({}, {formId: form.id, surveyId: survey.id});
      newSurvey = Object.assign({}, survey);
      newSurvey.surveyForms.push(newSurveyForm);
      newState = Object.assign({}, state);
      newState[survey.id] = newSurvey;
      return newState;
    case REMOVE_FORM:
      index  = action.payload.index;
      survey = action.payload.survey;
      survey.id = survey.id || 0;
      newSurvey = Object.assign({}, survey);
      newSurvey.surveyForms.splice(index, 1);
      newState = Object.assign({}, state);
      newState[survey.id] = newSurvey;
      return newState;
    case REORDER_FORM:
      survey = action.payload.survey;
      index = action.payload.index;
      direction = action.payload.direction;
      if(index == 0  && direction == 1){
        return state;
      }
      newSurvey = Object.assign({}, survey);
      newSurvey.surveyForms = move(survey.surveyForms, index, index-direction);
      newState = Object.assign({}, state);
      newState[survey.id||0] = newSurvey;
      return newState;
    default:
      return state;
  }
}


let move = (array, from, to) => {
  let copyArray = array.slice(0);
  copyArray.splice(to, 0, copyArray.splice(from, 1)[0]);
  return copyArray;
};
