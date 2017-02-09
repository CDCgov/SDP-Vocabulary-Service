import {
  FETCH_FORM_FULFILLED,
  FETCH_FORMS_FULFILLED,
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION

} from '../actions/types';
import _ from 'lodash';

export default function forms(state = {}, action) {
  switch (action.type) {
    case FETCH_FORMS_FULFILLED:
      return _.keyBy(action.payload.data, 'id');
    case FETCH_FORM_FULFILLED:
      const formClone = Object.assign({}, state);
      formClone[action.payload.data.id] = action.payload.data;
      return formClone;
    case ADD_QUESTION:
      var {question, form} = action.payload;
      // let formQuestionIds = form.formQuestions.map((e) => e.id);
      // if (formQuestionIds.includes(question.id)) {
      //   return state;
      // }
      var newFormQuestion = Object.assign({}, {questionId: question.id, formId: form.id});
      var newForm = Object.assign({}, form);
      newForm.formQuestions.push(newFormQuestion);
      var newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState;
    case REMOVE_QUESTION:
      var { form , index } = action.payload;
      var newForm = Object.assign({}, form);
      newForm.formQuestions.splice(index, 1);
      var newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState;
    case REORDER_QUESTION:
      var { form, index, direction } = action.payload;
      var newForm = Object.assign({}, form);
      newForm.formQuestions = move(form.formQuestions, index, index-direction);
      var newState = Object.assign({}, state);
      newState[form.id] = newForm;
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
