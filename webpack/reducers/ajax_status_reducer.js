import {
  FETCH_SECTION_FULFILLED,
  FETCH_SECTION_PENDING,
  FETCH_SECTION_FAILURE,
  FETCH_SECTION,
  ADD_ENTITIES_FULFILLED
} from '../actions/types';
import * as helpers from './helpers';

const defaultState = {
  question:     { isLoading: false, loadStatus: null, loadStatusText:''},
  responseSet : { isLoading: false, loadStatus: null, loadStatusText:''},
  section:      { isLoading: false, loadStatus: null, loadStatusText:''},
  survey:       { isLoading: false, loadStatus: null, loadStatusText:''}
};

export default function ajaxStatus(state = defaultState, action) {
  let loadStatusText;
  switch (action.type) {
    case FETCH_SECTION_FULFILLED:
    case ADD_ENTITIES_FULFILLED:
      return Object.assign({}, state, {section:{ isLoading: false, loadStatus: 'success', loadStatusText : 'fetch section success' }});
    case FETCH_SECTION_FAILURE:
      loadStatusText = `An error occurred while trying to load this section: ${action.status} / ${action.statusText}`
      return Object.assign({},state,{section:{
        isLoading: false,
        loadStatus : 'failure',
        loadStatusText
        }
      });
    case FETCH_SECTION_PENDING:
      return Object.assign({},state, {section : { isLoading: true, loadStatus: null, loadStatusText:'fetch section pending' }});
    case FETCH_SECTION:
      return Object.assign({},state, {section : { isLoading: false, loadStatus: null, loadStatusText:''}});
    default:
      return state;
  }
}
