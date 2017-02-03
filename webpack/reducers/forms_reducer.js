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
      var newQuestion = Object.assign({}, question);
      var newForm = Object.assign({}, form);
      newForm.questions.push(newQuestion);
      var newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState
    case REMOVE_QUESTION:
      var { form , index } = action.payload;
      var newForm = Object.assign({}, form)
      newForm.questions.splice(index, 1);
      var newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState;
    case REORDER_QUESTION:
      var { form, index, direction } = action.payload;
      var newForm = Object.assign({}, form);
      newForm.questions = move(form.questions, index, index-direction);
      var newState = Object.assign({}, state);
      newState[form.id] = newForm;
      return newState;
    default:
      return state;
  }
}
