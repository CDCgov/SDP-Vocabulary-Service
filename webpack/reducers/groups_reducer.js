import {
  FETCH_GROUPS_FULFILLED,
  CREATE_GROUP_FULFILLED,
  ADD_USER_TO_GROUP_FULFILLED,
  REMOVE_USER_FROM_GROUP_FULFILLED
} from '../actions/types';

export default function tags(state = [], action) {
  if (action.type === FETCH_GROUPS_FULFILLED || action.type === CREATE_GROUP_FULFILLED ||
      action.type === ADD_USER_TO_GROUP_FULFILLED || action.type === REMOVE_USER_FROM_GROUP_FULFILLED ) {
    return action.payload.data;
  }
  return state;
}
