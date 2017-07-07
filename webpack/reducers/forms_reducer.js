import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED,
  FETCH_FORM_FROM_MIDDLE_FULFILLED,
  FETCH_FORMS_FROM_MIDDLE_FULFILLED,
  PUBLISH_FORM_FULFILLED,
  DELETE_FORM_FULFILLED,
  SAVE_DRAFT_FORM_FULFILLED,
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  CREATE_FORM
} from '../actions/types';
import keyBy from 'lodash/keyBy';
import * as helpers from './helpers';

export default function forms(state = {}, action) {
  let form, newState, newForm, question, responseSetId;
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      return helpers.fetchGroup(state, action);
    case FETCH_FORMS_FROM_MIDDLE_FULFILLED:
      let newData = action.payload.data.slice();
      newData.forEach((obj) => {
        obj['fromMiddleware'] = true;
      });
      return Object.assign({}, state, keyBy(newData, 'id'));
    case PUBLISH_FORM_FULFILLED:
    case SAVE_DRAFT_FORM_FULFILLED:
    case FETCH_FORM_FULFILLED:
      return helpers.fetchIndividual(state, action);
    case FETCH_FORM_FROM_MIDDLE_FULFILLED:
      newState = Object.assign({}, state);
      newState[action.payload.data.id] = action.payload.data;
      newState[action.payload.data.id]['fromMiddleware'] = true;
      return newState;
    case CREATE_FORM:
      newState = Object.assign({}, state);
      newState[0] = {formQuestions: [], questions: [], version: 1, id: 0};
      return newState;
    case ADD_QUESTION:
      question = action.payload.question;
      form = action.payload.form;
      form.id = form.id || 0;
      if(state[form.id] && state[form.id].formQuestions.findIndex( (s) => s.questionId == question.id) > -1){
        return state;
      }
      if(question.responseSets && question.responseSets[0]){
        responseSetId = question.responseSets[0].id || question.responseSets[0];
      } else {
        responseSetId = null;
      }
      let newFormQuestion = Object.assign({}, {questionId: question.id, formId: form.id, responseSetId: responseSetId, position: form.formQuestions.length});
      newForm  = Object.assign({}, form);
      newForm.formQuestions.push(newFormQuestion);
      newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState;
    case REMOVE_QUESTION:
      return helpers.removeNestedItem(state, action, 'form', 'formQuestions');
    case REORDER_QUESTION:
      return helpers.reorderNestedItem(state, action, 'form', 'formQuestions');
    case DELETE_FORM_FULFILLED:
      return helpers.deleteItem(state, action);
    default:
      return state;
  }
}
