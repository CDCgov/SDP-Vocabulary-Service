import {
  PUBLISH_FORM_FULFILLED,
  DELETE_FORM_FULFILLED,
  SAVE_DRAFT_FORM_FULFILLED,
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  CREATE_FORM,
  ADD_ENTITIES_FULFILLED
} from '../actions/types';
import * as helpers from './helpers';

export default function forms(state = {}, action) {
  let form, newState, newForm, question, responseSetId;
  switch (action.type) {
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.forms);
    case PUBLISH_FORM_FULFILLED:
    case SAVE_DRAFT_FORM_FULFILLED:
      return helpers.fetchIndividual(state, action);
    case CREATE_FORM:
      newState = Object.assign({}, state);
      newState[0] = {formQuestions: [], questions: [], version: 1, id: 0};
      return newState;
    case ADD_QUESTION:
      question = action.payload.question;
      form = action.payload.form;
      form.id = form.id || 0;
      if(state[form.id] && state[form.id].formQuestions && state[form.id].formQuestions.findIndex( (s) => s.questionId == question.id) > -1){
        return state;
      }
      if(question.responseSets && question.responseSets[0]){
        responseSetId = question.responseSets[0].id || question.responseSets[0];
      } else {
        responseSetId = null;
      }
      if(!form.formQuestions) {
        form.formQuestions = [];
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
