import {
  FETCH_SECTION_SUCCESS,
  FETCH_SECTION_PENDING,
  FETCH_SECTION_FAILURE,
  FETCH_QUESTION_SUCCESS,
  FETCH_QUESTION_PENDING,
  FETCH_QUESTION_FAILURE,
  FETCH_RESPONSE_SET_SUCCESS,
  FETCH_RESPONSE_SET_PENDING,
  FETCH_RESPONSE_SET_FAILURE,
  FETCH_SURVEY_SUCCESS,
  FETCH_SURVEY_FAILURE,
  FETCH_SURVEY_PENDING,
  CLEAR_AJAX_STATUS

} from '../actions/types';

function getLoadStatusText(action,type) {
  if (action.status == '403') {
    return "You do not have access to this resource.";
  }
  return `An error occurred while trying to load this ${type}: ${action.status} / ${action.statusText}`;
}

export default function ajaxStatus(state = {
  question:     { isLoading: false, loadStatus: null, loadStatusText:''},
  responseSet : { isLoading: false, loadStatus: null, loadStatusText:''},
  section:      { isLoading: false, loadStatus: null, loadStatusText:''},
  survey:       { isLoading: false, loadStatus: null, loadStatusText:''}
}, action) {
  switch (action.type) {
    case CLEAR_AJAX_STATUS:
      return Object.assign({}, state, {
        question:{ isLoading: false, loadStatus: null, loadStatusText:''},
        responseSet: { isLoading: false, loadStatus: null, loadStatusText:''},
        section: { isLoading: false, loadStatus: null, loadStatusText:''},
        survey: { isLoading: false, loadStatus: null, loadStatusText:''}
      });
    case FETCH_SECTION_SUCCESS:
      return Object.assign({}, state, {section:{ isLoading: false, loadStatus: 'success', loadStatusText : 'fetch section success' }});
    case FETCH_SECTION_FAILURE:
      return Object.assign({},state,{section:{
        isLoading: false,
        loadStatus : 'failure',
        loadStatusText : getLoadStatusText(action,'section')
      }});
    case FETCH_SECTION_PENDING:
      return Object.assign({},state, {section : { isLoading: true, loadStatus: null, loadStatusText:'fetch section pending' }});
    case FETCH_QUESTION_SUCCESS:
      return Object.assign({}, state, {question:{ isLoading: false, loadStatus: 'success', loadStatusText : 'fetch question success' }});
    case FETCH_QUESTION_FAILURE:
      return Object.assign({},state,{question:{
        isLoading: false,
        loadStatus : 'failure',
        loadStatusText : getLoadStatusText(action,'question')
      }});
    case FETCH_QUESTION_PENDING:
      return Object.assign({},state, {question : { isLoading: true, loadStatus: null, loadStatusText:'fetch question pending' }});
    case FETCH_RESPONSE_SET_SUCCESS:
      return Object.assign({}, state, {responseSet:{ isLoading: false, loadStatus: 'success', loadStatusText : 'fetch response set success' }});
    case FETCH_RESPONSE_SET_FAILURE:
      return Object.assign({},state,{responseSet:{
        isLoading: false,
        loadStatus : 'failure',
        loadStatusText : getLoadStatusText(action,'response set')
      }});
    case FETCH_RESPONSE_SET_PENDING:
      return Object.assign({},state, {responseSet : { isLoading: true, loadStatus: null, loadStatusText:'fetch response set pending' }});
    case FETCH_SURVEY_SUCCESS:
      return Object.assign({}, state, {survey:{ isLoading: false, loadStatus: 'success', loadStatusText : 'fetch survey success' }});
    case FETCH_SURVEY_FAILURE:
      return Object.assign({},state,{survey:{
        isLoading: false,
        loadStatus : 'failure',
        loadStatusText : getLoadStatusText(action,'survey')
      }});
    case FETCH_SURVEY_PENDING:
      return Object.assign({},state, {survey : { isLoading: true, loadStatus: null, loadStatusText:'fetch survey pending' }});
    default:
      return state;
  }
}
