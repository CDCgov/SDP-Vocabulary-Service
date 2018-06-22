import {
  PUBLISH_SECTION_FULFILLED,
  RETIRE_SECTION_FULFILLED,
  DELETE_SECTION_FULFILLED,
  SAVE_DRAFT_SECTION_FULFILLED,
  ADD_NESTED_ITEM,
  REMOVE_NESTED_ITEM,
  REORDER_NESTED_ITEM,
  CREATE_SECTION,
  ADD_ENTITIES_FULFILLED,
  ADD_SECTION_TO_GROUP_FULFILLED,
  REMOVE_SECTION_FROM_GROUP_FULFILLED,
  UPDATE_SECTION_TAGS_FULFILLED,
  UPDATE_PDV_FULFILLED
} from '../actions/types';
import * as helpers from './helpers';

export default function sections(state = {}, action) {
  let section, newState, newSection, responseSetId, sni, sniType, qid, nsid;
  switch (action.type) {
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, action.payload.sections);
    case PUBLISH_SECTION_FULFILLED:
    case RETIRE_SECTION_FULFILLED:
    case SAVE_DRAFT_SECTION_FULFILLED:
    case UPDATE_SECTION_TAGS_FULFILLED:
    case UPDATE_PDV_FULFILLED:
    case ADD_SECTION_TO_GROUP_FULFILLED:
    case REMOVE_SECTION_FROM_GROUP_FULFILLED:
      return helpers.fetchIndividual(state, action);
    case CREATE_SECTION:
      newState = Object.assign({}, state);
      newState[0] = {sectionNestedItems: [], questions: [], version: 1, id: 0};
      return newState;
    case ADD_NESTED_ITEM:
      sni = action.payload.nestedItem;
      sniType = action.payload.type;
      section = action.payload.section;
      section.id = section.id || 0;
      if(sniType === 'question' && state[section.id] && state[section.id].sectionNestedItems && state[section.id].sectionNestedItems.findIndex( (s) => s.questionId == sni.id) > -1){
        return state;
      } else if (sniType === 'section' && state[section.id] && state[section.id].sectionNestedItems && state[section.id].sectionNestedItems.findIndex( (s) => s.nestedSectionId == sni.id) > -1) {
        return state;
      }
      if(sni.responseSets && sni.responseSets[0]){
        responseSetId = sni.responseSets[0].id || sni.responseSets[0];
      } else {
        responseSetId = null;
      }
      if(!section.sectionNestedItems) {
        section.sectionNestedItems = [];
      }
      if(sniType === 'question') {
        qid = sni.id;
        nsid = null;
      } else {
        nsid = sni.id;
        qid = null;
      }
      let newSectionNestedItem = Object.assign({}, {questionId: qid, nestedSectionId: nsid, sectionId: section.id, responseSetId: responseSetId, position: section.sectionNestedItems.length});
      newSection = Object.assign({}, section);
      newSection.sectionNestedItems.push(newSectionNestedItem);
      newState = Object.assign({}, state);
      newState[section.id] = newSection;
      return newState;
    case REMOVE_NESTED_ITEM:
      return helpers.removeNestedItem(state, action, 'section', 'sectionNestedItems');
    case REORDER_NESTED_ITEM:
      return helpers.reorderNestedItem(state, action, 'section', 'sectionNestedItems');
    case DELETE_SECTION_FULFILLED:
      return helpers.deleteItem(state, action);
    default:
      return state;
  }
}
