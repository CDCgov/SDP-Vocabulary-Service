import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED,
  PUBLISH_FORM_FULFILLED,
  DELETE_FORM_FULFILLED,
  SAVE_DRAFT_FORM_FULFILLED,
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  CREATE_FORM
} from '../actions/types';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';

export default function forms(state = {}, action) {
  let form , index, newState, newForm, direction, question, responseSetId;
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      return Object.assign({}, state, keyBy(action.payload.data, 'id'));
    case PUBLISH_FORM_FULFILLED:
    case SAVE_DRAFT_FORM_FULFILLED:
    case FETCH_FORM_FULFILLED:
      const formClone = Object.assign({}, state);
      formClone[action.payload.data.id] = action.payload.data;
      return formClone;
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
      form  = action.payload.form;
      index = action.payload.index;
      form.id = form.id || 0;
      newForm = Object.assign({}, form);
      newForm.formQuestions.splice(index, 1);
      newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState;
    case REORDER_QUESTION:
      form  = action.payload.form;
      index = action.payload.index;
      direction = action.payload.direction;
      if(index == 0  && direction == 1){
        return state;
      }
      newForm = Object.assign({}, form);
      newForm.formQuestions = move(form.formQuestions, index, index-direction);
      newState = Object.assign({}, state);
      newState[form.id||0] = newForm;
      return newState;
    case DELETE_FORM_FULFILLED:
      return omitBy(state,(v, k)=>{
        return action.payload.data.id==k;
      });
    default:
      return state;
  }
}


let move = (array, from, to) => {
  let copyArray = array.slice(0);
  copyArray.splice(to, 0, copyArray.splice(from, 1)[0]);
  for(var i = 0; i < copyArray.length; i++){
    copyArray[i].position = i;
  }
  return copyArray;
};
