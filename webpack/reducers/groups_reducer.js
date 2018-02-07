import {
  FETCH_GROUPS_FULFILLED,
  CREATE_GROUP_FULFILLED,
  ADD_USER_TO_GROUP_FULFILLED,
  REMOVE_USER_FROM_GROUP_FULFILLED
} from '../actions/types';

export default function groups(state = [], action) {
  switch (action.type) {
    case FETCH_GROUPS_FULFILLED:
    case CREATE_GROUP_FULFILLED:
      return action.payload.data;
    case ADD_USER_TO_GROUP_FULFILLED:
    case REMOVE_USER_FROM_GROUP_FULFILLED:
      return action.payload.data.groups;
    default:
      return state;
  }
}
