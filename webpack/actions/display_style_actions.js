import {
  SET_RESULT_STYLE,
  SHOW_RESULT_CONTROL,
  HIDE_RESULT_CONTROL,
  TOGGLE_RESULT_CONTROL
} from './types';

export function setResultStyle(resultStyle) {
  return {
    type: SET_RESULT_STYLE,
    payload: {resultStyle:resultStyle}
  };
}
export function showResultControl() {
  return {
    type: SHOW_RESULT_CONTROL,
    payload: {resultControlVisibility:'visible'}
  };
}
export function hideResultControl() {
  return {
    type: HIDE_RESULT_CONTROL,
    payload: {resultControlVisibility:'hidden'}
  };
}
export function toggleResultControl(resultControlVisibility) {
  const vis = resultControlVisibility == 'visible' ? 'hidden' : 'visible';
  return {
    type: TOGGLE_RESULT_CONTROL,
    payload: {resultControlVisibility:vis}
  };
}
