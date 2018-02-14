import {
  SET_RESULT_STYLE,
  SHOW_RESULT_CONTROL,
  HIDE_RESULT_CONTROL,
  TOGGLE_RESULT_CONTROL
} from '../actions/types';

export default function(state={resultStyle:'expanded'}, action) {
  switch (action.type) {
    case SET_RESULT_STYLE:
      return Object.assign({}, state, {
        resultStyle:action.payload.resultStyle
      });
    case HIDE_RESULT_CONTROL:
    case SHOW_RESULT_CONTROL:
    case TOGGLE_RESULT_CONTROL:
      return Object.assign({}, state, {
        resultControlVisibility:action.payload.resultControlVisibility
      });
    default:
      return state;
  }
}
