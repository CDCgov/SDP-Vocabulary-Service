import {
  PUBLISH_SECTION_FULFILLED,
  DELETE_SECTION_FULFILLED,
  SAVE_DRAFT_SECTION_FULFILLED,
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  CREATE_SECTION,
  ADD_ENTITIES_FULFILLED
} from '../actions/types';
import * as helpers from './helpers';

export default function sections(state = {}, action) {
  let section, newState, newSection, question, responseSetId;
  switch (action.type) {
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.sections);
    case PUBLISH_SECTION_FULFILLED:
    case SAVE_DRAFT_SECTION_FULFILLED:
      return helpers.fetchIndividual(state, action);
    case CREATE_SECTION:
      newState = Object.assign({}, state);
      newState[0] = {sectionQuestions: [], questions: [], version: 1, id: 0};
      return newState;
    case ADD_QUESTION:
      question = action.payload.question;
      section = action.payload.section;
      section.id = section.id || 0;
      if(state[section.id] && state[section.id].sectionQuestions && state[section.id].sectionQuestions.findIndex( (s) => s.questionId == question.id) > -1){
        return state;
      }
      if(question.responseSets && question.responseSets[0]){
        responseSetId = question.responseSets[0].id || question.responseSets[0];
      } else {
        responseSetId = null;
      }
      if(!section.sectionQuestions) {
        section.sectionQuestions = [];
      }
      let newSectionQuestion = Object.assign({}, {questionId: question.id, sectionId: section.id, responseSetId: responseSetId, position: section.sectionQuestions.length});
      newSection  = Object.assign({}, section);
      newSection.sectionQuestions.push(newSectionQuestion);
      newState = Object.assign({}, state);
      newState[section.id] = newSection;
      return newState;
    case REMOVE_QUESTION:
      return helpers.removeNestedItem(state, action, 'section', 'sectionQuestions');
    case REORDER_QUESTION:
      return helpers.reorderNestedItem(state, action, 'section', 'sectionQuestions');
    case DELETE_SECTION_FULFILLED:
      return helpers.deleteItem(state, action);
    default:
      return state;
  }
}
