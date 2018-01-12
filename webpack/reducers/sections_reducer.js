import {
  PUBLISH_SECTION_FULFILLED,
  DELETE_SECTION_FULFILLED,
  SAVE_DRAFT_SECTION_FULFILLED,
  ADD_QUESTION,
  REMOVE_QUESTION,
  REORDER_QUESTION,
  CREATE_SECTION,
  ADD_ENTITIES_FULFILLED,
  ADD_SECTION_TO_GROUP_FULFILLED,
  UPDATE_SECTION_TAGS_FULFILLED,
  UPDATE_PDV_FULFILLED
} from '../actions/types';
import * as helpers from './helpers';

export default function sections(state = {}, action) {
  let section, newState, newSection, responseSetId, sqItem, sqItemType, qid, nsid;
  switch (action.type) {
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.sections);
    case PUBLISH_SECTION_FULFILLED:
    case SAVE_DRAFT_SECTION_FULFILLED:
    case UPDATE_SECTION_TAGS_FULFILLED:
    case UPDATE_PDV_FULFILLED:
    case ADD_SECTION_TO_GROUP_FULFILLED:
      return helpers.fetchIndividual(state, action);
    case CREATE_SECTION:
      newState = Object.assign({}, state);
      newState[0] = {sectionQuestions: [], questions: [], version: 1, id: 0};
      return newState;
    case ADD_QUESTION:
      sqItem = action.payload.question;
      sqItemType = action.payload.type;
      section = action.payload.section;
      section.id = section.id || 0;
      if(sqItemType === 'question' && state[section.id] && state[section.id].sectionQuestions && state[section.id].sectionQuestions.findIndex( (s) => s.questionId == sqItem.id) > -1){
        return state;
      } else if (sqItemType === 'section' && state[section.id] && state[section.id].sectionQuestions && state[section.id].sectionQuestions.findIndex( (s) => s.nestedSectionId == sqItem.id) > -1) {
        return state;
      }
      if(sqItem.responseSets && sqItem.responseSets[0]){
        responseSetId = sqItem.responseSets[0].id || sqItem.responseSets[0];
      } else {
        responseSetId = null;
      }
      if(!section.sectionQuestions) {
        section.sectionQuestions = [];
      }
      if(sqItemType === 'question') {
        qid = sqItem.id;
        nsid = null;
      } else {
        nsid = sqItem.id;
        qid = null;
      }
      let newSectionQuestion = Object.assign({}, {questionId: qid, nestedSectionId: nsid, sectionId: section.id, responseSetId: responseSetId, position: section.sectionQuestions.length});
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
