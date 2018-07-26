import {
  CLEAR_BREADCRUMB,
  ADD_BREADCRUMB_ITEM,
  REMOVE_BREADCRUMB_ITEM,
  SET_BREADCRUMB_PATH,
} from './types';

export function clearBreadcrumb() {
  return {
    type: CLEAR_BREADCRUMB,
    payload: {path:[]}
  };
}
export function addBreadcrumbItem(item) {
  return {
    type: ADD_BREADCRUMB_ITEM,
    payload: {item:item}
  };
}
export function removeBreadcrumbItem(item) {
  return {
    type: REMOVE_BREADCRUMB_ITEM,
    payload: {item:item}
  };
}
export function setBreadcrumbPath(path) {
  return {
    type: SET_BREADCRUMB_PATH,
    payload: {path:path}
  };
}
