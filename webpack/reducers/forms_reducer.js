import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED,
  PUBLISH_FORM_FULFILLED,
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  CREATE_FORM

} from '../actions/types';
import _ from 'lodash';

export default function forms(state = {}, action) {
  let form , index, newState, newForm, direction, question;
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      return Object.assign({}, state, _.keyBy(action.payload.data, 'id'));
    case PUBLISH_FORM_FULFILLED:
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
      let newFormQuestion = Object.assign({}, {questionId: question.id, formId: form.id});
      newForm = Object.assign({}, form);
      newForm.formQuestions.push(newFormQuestion);
      newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState;
    case REMOVE_QUESTION:
      form = action.payload.form;
      index = action.payload.index;
      newForm = Object.assign({}, form);
      newForm.formQuestions.splice(index, 1);
      newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState;
    case REORDER_QUESTION:
      form = action.payload.form;
      index = action.payload.index;
      direction = action.payload.direction;
      newForm = Object.assign({}, form);
      newForm.formQuestions = move(form.formQuestions, index, index-direction);
      newState = Object.assign({}, state);
      newState[form.id||0] = newForm;
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
